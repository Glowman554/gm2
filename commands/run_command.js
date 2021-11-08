import { BaseCommand } from "./base_command.js";
import { execute_gm_task } from "../core/gm-runtime/gm.js";

export class RunCommand extends BaseCommand {
	constructor(args) {
		super(args, null);
	}

	async execute() {
		if (this.args.length == 0) {
			throw new Error("No name specified");
		} else {
			while (this.args.length != 0) {
				var task_name = this.args.shift();
				await execute_gm_task(JSON.parse(Deno.readTextFileSync("gm2.json")), task_name);
			}
		}
	}
}
