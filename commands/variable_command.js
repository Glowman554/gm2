import { BaseCommand } from "./base_command.js";

export class VariableCommand extends BaseCommand {
	constructor(args) {
		super(args, [
			"--name",
			"--value"
		]);
	}

	execute() {
		var gm2_file_obj = JSON.parse(Deno.readTextFileSync("gm2.json"));

		var variable_name = this.parser.consume_option("--name");
		var value = this.parser.consume_option("--value");

		gm2_file_obj.variables[variable_name] = value;

		Deno.writeTextFileSync("gm2.json", JSON.stringify(gm2_file_obj, null, "\t"));
	}
}