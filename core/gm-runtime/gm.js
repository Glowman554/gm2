import { debug_log, set_non_silent } from "../logger.js";
import { exists, update_console_line_raw } from "../util.js";
import getFiles from "../../deno-getfiles/mod.ts";
import { csv } from "../csv.js";
import {createHash} from "https://deno.land/std@0.80.0/hash/mod.ts";

function hash_file(file_path) {
	const hash = createHash("md5");

	const file = Deno.openSync(Deno.realPathSync(file_path));

	for (const chunk of Deno.iterSync(file)) {
		hash.update(chunk);
	}

	let hash_str = hash.toString();

	Deno.close(file.rid);

	return hash_str;
}

async function apply_inline_function_findall(gm2_file_obj, command) {
	var findall_in_command = command.match(/\$\{findall [A-Za-z0-9_]+\}/g);
	if (findall_in_command !== null) {
		for (var j = 0; j < findall_in_command.length; j++) {
			var extension_to_search = findall_in_command[j].substring(10, findall_in_command[j].length - 1);

			var files_found = [];
			var files = getFiles(".");

			for (var k = 0; k < files.length; k++) {
				if (files[k].ext == extension_to_search) {
					files_found.push(files[k].path);
				}
			}

			debug_log(`Found ${files_found.length} files with extension ${extension_to_search}`);
			command = command.replace(findall_in_command[j], files_found.join(" "));
		}
	}
	return command;
}

async function apply_inline_function_findall_comma(gm2_file_obj, command) {
	var findall_in_command = command.match(/\$\{findall_comma [A-Za-z0-9_]+\}/g);
	if (findall_in_command !== null) {
		for (var j = 0; j < findall_in_command.length; j++) {
			var extension_to_search = findall_in_command[j].substring(16, findall_in_command[j].length - 1);

			var files_found = [];
			var files = getFiles(".");

			for (var k = 0; k < files.length; k++) {
				if (files[k].ext == extension_to_search) {
					files_found.push(files[k].path);
				}
			}

			debug_log(`Found ${files_found.length} files with extension ${extension_to_search}`);
			command = command.replace(findall_in_command[j], files_found.join(","));
		}
	}
	return command;
}

async function apply_inline_prompt(gm2_file_obj, command) {
	var prompt_in_command = command.match(/\$\{prompt\}/g);
	if (prompt_in_command !== null) {
		for (var j = 0; j < prompt_in_command.length; j++) {
			debug_log(`Prompting for input`);
			var input = prompt(" > ");

			command = command.replace(prompt_in_command[j], input);
		}
	}

	return command;
}

async function apply_inline_functions(gm2_file_obj, command) {
	var inline_functions = [
		apply_inline_function_findall,
		apply_inline_function_findall_comma,
		apply_inline_prompt
	];

	for (let inline_function of inline_functions) {
		debug_log(`Applying inline function ${inline_function.name} for '${command}'`);
		command = await inline_function(gm2_file_obj, command);
	}

	return command;
}

async function lookup_variables(gm2_file_obj, command) {

	var variables_in_command = command.match(/\$\{[^}]+\}/g);
	if (variables_in_command !== null) {
		for (var j = 0; j < variables_in_command.length; j++) {
			var variable_name = variables_in_command[j].substring(2, variables_in_command[j].length - 1);
				
			if ((!gm2_file_obj.variables || !gm2_file_obj.variables[variable_name]) && !Deno.env.get(variable_name)) {
				throw new Error("Variable not found: " + variable_name);
			}

			var variable_value = gm2_file_obj.variables[variable_name] ? gm2_file_obj.variables[variable_name] : Deno.env.get(variable_name);

			debug_log(`Replacing variable ${variable_name} with value "${variable_value}"`);

			command = command.replace(variables_in_command[j], variable_value);
		}
	}

	return command;
}

async function preprocess_command(gm2_file_obj, command) {
	command = await apply_inline_functions(gm2_file_obj, command);
	command = await lookup_variables(gm2_file_obj, command);

	return command;
}

async function run_commands(gm2_file_obj, commands, allow_fail, file_path = null, build_info = null) {
	for (let command of commands) {
		if (file_path) {
			command = command.replace(/\${file}/g, file_path);
		}

		update_console_line_raw(`> ${command}${gm2_file_obj.non_silent ? "\n" : ""}`);

		command = await preprocess_command(gm2_file_obj, command);

		if (build_info) {
			build_info.csv.pushRow([ build_info.task_name, command ]);
		}

		var actual_command = [];
		for (let i of command.split(" ")) {
			if (i != "") {
				actual_command.push(i);
			}
		}

		let p = Deno.run({
			cmd: actual_command,
			stdout: !gm2_file_obj.non_silent ? "piped" : "inherit",
			stderr: !gm2_file_obj.non_silent ? "piped" : "inherit",
			stdin: "inherit"
		});

		var status = await p.status();

		if (!status.success) {
			if (!allow_fail) {
				throw new Error(`Command failed: ${command}`);
			} else {
				debug_log(`Command failed: ${command}`);
			}
		}
	}
}


async function run_in_dir(task_obj, func) {
	var current_dir = Deno.cwd();

	if (task_obj.run_in != undefined) {
		debug_log("Changing directory to: " + task_obj.run_in);
		Deno.chdir(task_obj.run_in);
	}

	await func();

	Deno.chdir(current_dir);
}

export async function execute_gm_task(gm2_file_obj, task_name, build_info = null) {
	if (gm2_file_obj.non_silent) {
		set_non_silent();
	}

	var task_dir = gm2_file_obj.task_dir;

	if (!exists(`${task_dir}/${task_name}.json`)) {
		throw new Error(`Task ${task_name} does not exist.`);
	}

	if (build_info == null) {
		build_info = new csv();
		build_info.pushRow([ "Task name", "Executed commands" ]);
		build_info.pushRow([ "", "" ]);
	}

	var task_obj = JSON.parse(Deno.readTextFileSync(`${task_dir}/${task_name}.json`));

	for (let dependency of task_obj.dependencies) {
		debug_log(`Executing dependency ${dependency}`);
		await execute_gm_task(gm2_file_obj, dependency, build_info);
	}

	if (task_obj.run_for) {
		debug_log(`Executing task ${task_name} for every .${task_obj.run_for} file`);

		await run_in_dir(task_obj, async () => {
			var cache = {};
			try {
				cache = JSON.parse(Deno.readTextFileSync(".gm2.cache"));
			} catch (e) {
				debug_log(String(e));
			}

			var files = getFiles(".");
			for (let file of files) {
				if (file.ext == task_obj.run_for || task_obj.run_for == "*") {
					if (cache[file.path] != undefined) {
						if (hash_file(file.path) == cache[file.path]) {
							debug_log("file didnt change skipping...");
							continue;
						}
					}
					debug_log(`Executing task ${task_name} for ${file.path}`);
					await run_commands(gm2_file_obj, task_obj.commands, task_obj.allow_fail, file.path, {
						task_name: task_name,
						csv: build_info
					});

					cache[file.path] = hash_file(file.path);
				}
			}

			Deno.writeTextFileSync(".gm2.cache", JSON.stringify(cache, null, "\t"));
		});
	} else {
		debug_log(`Executing task ${task_name}`);
		await run_in_dir(task_obj, async () => {
			await run_commands(gm2_file_obj, task_obj.commands, task_obj.allow_fail, null, {
				task_name: task_name,
				csv: build_info
			});
		});
	}

	for (let task of task_obj.run_after_task) {
		debug_log(`Executing after task ${task}`);
		await execute_gm_task(gm2_file_obj, task, build_info);
	}

	update_console_line_raw(`> Finished task ${task_name}`);
	console.log("");

	return build_info;
}
