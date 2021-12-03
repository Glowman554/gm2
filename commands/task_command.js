import { BaseCommand } from "./base_command.js";

export class TaskCommand extends BaseCommand {
	constructor(args) {
		super(args, [
			"--name",
			"--command",
			"--dependency",
			"--run_after_task",
			"--run_in_dir",
			"--allow_fail",
			"--run_for"
		]);
	}

	execute() {
		var task_dir = JSON.parse(Deno.readTextFileSync("gm2.json")).task_dir;

		var task_obj = {};

		task_obj.name = this.parser.consume_option("--name");
		
		task_obj.commands = [];
		while (this.parser.is_option_set("--command")) {
			task_obj.commands.push(this.parser.consume_option("--command"));
		}

		task_obj.dependencies = [];
		while (this.parser.is_option_set("--dependency")) {
			task_obj.dependencies.push(this.parser.consume_option("--dependency"));
		}

		task_obj.run_after_task = [];
		while (this.parser.is_option_set("--run_after_task")) {
			task_obj.run_after_task.push(this.parser.consume_option("--run_after_task"));
		}

		task_obj.allow_fail = this.parser.is_option_set("--allow_fail");

		if (this.parser.is_option_set("--run_for")) {
			task_obj.run_for = this.parser.consume_option("--run_for");
		}
		
		if (this.parser.is_option_set("--run_in_dir")) {
			task_obj.run_in = this.parser.consume_option("--run_for");
		}

		Deno.writeTextFileSync(task_dir + "/" + task_obj.name + ".json", JSON.stringify(task_obj, null, "\t"));
	}
}
