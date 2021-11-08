import { commands } from "./commands/commands.js";
import { write_title } from "./core/figlet.js";

async function main() {
	try {
		if (Deno.lstatSync("gm2.json").isFile) {
			let maybe_custom_header = JSON.parse(Deno.readTextFileSync("gm2.json")).custom_header;
			if (maybe_custom_header) {
				await write_title(maybe_custom_header);
			} else {
				await write_title("gm v2");
			}
		} else {
			await write_title("gm v2");
		}
	} catch (_) {
		await write_title("gm v2");
	}

	var arg_copy = Object.assign([], Deno.args);
	var sub_command = arg_copy.shift();

	if (sub_command == undefined) {
		throw new Error("No sub command specified");
	}

	var command = commands.find(command => command.name == sub_command);

	if (!command) {
		throw new Error(`Command ${sub_command} not found`);
	} else {
		await (new command.command(arg_copy)).execute();
	}
}

await main();