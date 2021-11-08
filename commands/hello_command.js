import { BaseCommand } from "./base_command.js";

export class HelloCommand extends BaseCommand {
	constructor(args) {
		super(args, []);
	}

	execute() {
		console.log("Hello, world!");
	}
}