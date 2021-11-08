import { BaseCommand } from "./base_command.js";
import { commands } from "./commands.js";

export class HelpCommand extends BaseCommand {
	constructor(args) {
		super(args, []);
	}

	execute() {
		console.log("Possible commands:");
		for (let command of commands) {
			console.log("> " + command.name);
		}
	}
}