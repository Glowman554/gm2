import { ArgParser } from "../core/argparser.js";

export class BaseCommand {
	constructor(args, possible_args) {
		this.args = args;
		this.possible_args = possible_args;
		if (possible_args) {
			this.parser = new ArgParser(this.args, this.possible_args);
			this.parser.parse();
		} else {
			this.parser = null;
		}
	}

	execute() {
		throw new Error("execute() not implemented");
	}
}