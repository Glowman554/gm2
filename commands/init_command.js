import { BaseCommand } from "./base_command.js";

export class InitCommand extends BaseCommand {
	constructor(args) {
		super(args, [
			"--name",
			"--description",
			"--author",
			"--version",
			"--task_dir",
			"--custom_header",
			"--variable",
			"--non_silent"
		]);
	}

	execute() {
		var gm2_file_obj = {};

		gm2_file_obj.name = this.parser.consume_option("--name");
		gm2_file_obj.description = this.parser.consume_option("--description", "Default description lol");
		gm2_file_obj.author = this.parser.consume_option("--author", Deno.env.get(Deno.build.os == "windows" ? "USERNAME" : "USER"));
		gm2_file_obj.version = this.parser.consume_option("--version", "0.0.1");
		gm2_file_obj.task_dir = this.parser.consume_option("--task_dir", "tasks");
		
		if (this.parser.is_option_set("--custom_header")) {
			gm2_file_obj.custom_header = this.parser.consume_option("--custom_header");
		}

		gm2_file_obj.variables = {};
		while (this.parser.is_option_set("--variable")) {
			var variable = this.parser.consume_option("--variable").split(":");
			gm2_file_obj.variables[variable[0]] = variable[1];
		}

		gm2_file_obj.non_silent = this.parser.is_option_set("--non_silent");

		Deno.writeTextFileSync("gm2.json", JSON.stringify(gm2_file_obj, null, "\t"));

		Deno.mkdirSync(gm2_file_obj.task_dir, { recursive: true });
	}
}