import { BaseCommand } from "./base_command.js";
import { c_preset, mik_preset } from "../core/presets.js";

var presets = [
	c_preset,
	mik_preset
];

export class PresetsCommand extends BaseCommand {
	constructor(args) {
		super(args, [
			"--name",
			"--list"
		]);
	}

	execute() {
		if (!(this.parser.is_option_set("--name") || this.parser.is_option_set("--list"))) {
			throw new Error("No action specified. Please use --name or --list");
		}

		if (this.parser.is_option_set("--list")) {
			console.log("Aviable presets:");

			presets.forEach(preset => {
				console.log("> " + preset.name);
			});
		}


		if (this.parser.is_option_set("--name")) {
			var task_dir = JSON.parse(Deno.readTextFileSync("gm2.json")).task_dir;
			let preset_name = this.parser.consume_option("--name");

			var preset = presets.find(preset => preset.name === preset_name);

			if (preset == undefined) {
				throw new Error("Preset " + preset_name + " not found");
			}

			preset.preset.forEach(task => {
				console.log("Creating task " + task.task_name);
				Deno.writeTextFileSync(task_dir + "/" + task.task_name + ".json", JSON.stringify(task.content, null, "\t"));
			});
		}
	}
}