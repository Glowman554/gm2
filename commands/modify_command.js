import { BaseCommand } from "./base_command.js";

export class ModifyCommand extends BaseCommand {
	constructor(args) {
		super(args, [
			"--name",
			"--command",
			"--del_old_commands",
			"--dependency",
			"--del_old_dependencies",
			"--run_after_task",
			"--run_in_dir",
			"--allow_fail",
			"--no_allow_fail",
			"--run_for"
		]);
	}

	execute() {
		var task_dir = JSON.parse(Deno.readTextFileSync("gm2.json")).task_dir;

		let name = this.parser.consume_option("--name");
		var task_obj = JSON.parse(Deno.readTextFileSync(task_dir + "/" + name + ".json"));

		if (this.parser.is_option_set("--command")) {
			let commands = []
			while (this.parser.is_option_set("--command")) {
				commands.push(this.parser.consume_option("--command"));
			}

			if (this.parser.is_option_set("--del_old_commands")) {
				task_obj.commands = commands;
			} else {
				task_obj.commands = task_obj.commands.concat(commands);
			}
		}

		if (this.parser.is_option_set("--dependency")) {
			let dependencies = []
			while (this.parser.is_option_set("--dependency")) {
				dependencies.push(this.parser.consume_option("--dependency"));
			}

			if (this.parser.is_option_set("--del_old_dependencies")) {
				task_obj.dependencies = dependencies;
			} else {
				task_obj.dependencies = task_obj.dependencies.concat(dependencies);
			}
		}

		if (this.parser.is_option_set("--run_after_task")) {
			task_obj.run_after_task = this.parser.consume_option("--run_after_task");
		}

		if (this.parser.is_option_set("--run_in_dir")) {
			task_obj.run_in = this.parser.consume_option("--run_in_dir");
		}

		if (this.parser.is_option_set("--allow_fail")) {
			task_obj.allow_fail = true;
		}

		if (this.parser.is_option_set("--no_allow_fail")) {
			task_obj.allow_fail = false;
		}

		if (this.parser.is_option_set("--run_for")) {
			task_obj.run_for = this.parser.consume_option("--run_for");
		}

		Deno.writeTextFileSync(task_dir + "/" + name + ".json", JSON.stringify(task_obj, null, "\t"));
	}
}