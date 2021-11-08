import { HelloCommand } from "./hello_command.js";
import { InitCommand } from "./init_command.js";
import { TaskCommand } from "./task_command.js";
import { VariableCommand } from "./variable_command.js";
import { HelpCommand } from "./help_command.js";
import { RunCommand } from "./run_command.js";

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
	}
];