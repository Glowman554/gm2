import { BaseCommand } from "./base_command.js";
import { gm_info } from "../core/gm-runtime/gm_info.js";

export class InfoCommand extends BaseCommand {
	constructor(args) {
		super(args, []);
	}

	execute() {
		console.log(gm_info(JSON.parse(Deno.readTextFileSync("gm2.json"))));
	}
}