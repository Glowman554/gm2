export var mik_preset = {
	name: "mik",
	preset: [
		{
			task_name: "mik_comp",
			content: {
				"name": "mik_comp",
				"commands": [
					"python3 ${mik_install_path} -i ${file} -o ${file}"
				],
				"dependencies": [],
				"run_after_task": [],
				"allow_fail": false,
				"run_for": "mik"
			}
		},
		{
			task_name: "c_comp",
			content: {
				"name": "c_comp",
				"commands": [
					"gcc ${file} -o ${file}.o -c ${cflags}"
				],
				"dependencies": [
					"mik_comp"
				],
				"run_after_task": [],
				"allow_fail": false,
				"run_for": "c"
			}
		},
		{
			task_name: "link",
			content: {
				"name": "link",
				"commands": [
					"ld ${ldflags} -o app.elf ${findall o}"
				],
				"dependencies": [
					"mik_comp"
				],
				"run_after_task": [],
				"allow_fail": false
			}
		}
	]
}

export var c_preset = {
	name: "c",
	preset: [
		{
			task_name: "c_comp",
			content: {
				"name": "c_comp",
				"commands": [
					"gcc ${file} -o ${file}.o -c ${cflags}"
				],
				"dependencies": [],
				"run_after_task": [],
				"allow_fail": false,
				"run_for": "c"
			}
		},
		{
			task_name: "link",
			content: {
				"name": "link",
				"commands": [
					"ld ${ldflags} -o app.elf ${findall o}"
				],
				"dependencies": [
					"c_comp"
				],
				"run_after_task": [],
				"allow_fail": false
			}
		}
	]
};