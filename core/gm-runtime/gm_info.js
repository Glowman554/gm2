import getFiles from "../../deno-getfiles/mod.ts";


export function gm_info(gm2_file_obj) {
	var _return = "";

	_return += "Project info:\n";
	_return += "> Name: " + gm2_file_obj.name + "\n";
	_return += "> Description " + gm2_file_obj.description + "\n";
	_return += "> Author: " + gm2_file_obj.author + "\n";
	_return += "> Version: " + gm2_file_obj.version + "\n";
	gm2_file_obj.custom_header ? _return += "> Custom header: " + gm2_file_obj.custom_header + "\n" : "\n";
	_return += "> Tasks: " + getFiles(gm2_file_obj.task_dir).map(file => file.name).map(file => file.replace(".json", "")).join(", ") + "\n";
	_return += "> Variables:" + "\n";
	for (let variable in gm2_file_obj.variables) {
		_return += "> > " + variable + ": " + gm2_file_obj.variables[variable] + "\n";
	}

	return _return;
}