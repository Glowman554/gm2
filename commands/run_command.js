import { BaseCommand } from "./base_command.js";
import { execute_gm_task } from "../core/gm-runtime/gm.js";

export class RunCommand extends BaseCommand {
	constructor(args) {
		super(args, [
			"--print_build_info",
			"--save_build_info"
		]);
	}

	async execute() {
		if (this.args.length == 0) {
			throw new Error("No name specified");
		} else {
			while (this.args.length != 0) {
				if (this.args[0].startsWith("--")) {
					this.args.shift();
					continue;
				}

				var task_name = this.args.shift();
				var build_info = await execute_gm_task(JSON.parse(Deno.readTextFileSync("gm2.json")), task_name);
				if (this.parser.is_option_set("--print_build_info")) {
					console.log(build_info.str());
				}
				if (this.parser.is_option_set("--save_build_info")) {
					Deno.writeTextFileSync(this.parser.consume_option("--save_build_info"), build_info.serialize());
				}
			}
		}
	}
}
