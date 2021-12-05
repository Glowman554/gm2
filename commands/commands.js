import { HelloCommand } from "./hello_command.js";
import { InitCommand } from "./init_command.js";
import { TaskCommand } from "./task_command.js";
import { VariableCommand } from "./variable_command.js";
import { HelpCommand } from "./help_command.js";
import { RunCommand } from "./run_command.js";
import { InfoCommand } from "./info_command.js";
import { ModifyCommand } from "./modify_command.js";
import { PresetsCommand } from "./presets_command.js";

export var commands = [
	{
		name: "help",
		command: HelpCommand
	},
	{
		name: "hello",
		command: HelloCommand
	},
	{
		name: "init",
		command: InitCommand
	},
	{
		name: "task",
		command: TaskCommand
	},
	{
		name: "variable",
		command: VariableCommand
	},
	{
		name: "run",
		command: RunCommand
	},
	{
		name: "info",
		command: InfoCommand
	},
	{
		name: "modify",
		command: ModifyCommand
	},
	{
		name: "presets",
		command: PresetsCommand
	}
];