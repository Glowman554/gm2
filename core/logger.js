let silent = true;

export function set_non_silent() {
	silent = false;
}

export function debug_log(what) {
	const date = new Date(Date.now()).toUTCString();
	var log_entry = "[" + date + "] " + what;


	var log_file = ".gm2.log";

	try {
		if (!Deno.lstatSync(log_file).isFile) {
			Deno.writeTextFileSync(log_file, "----- Log file created -----\n");
		}
	} catch (e) {
		Deno.writeTextFileSync(log_file, "----- Log file created -----\n");
	}

	Deno.writeTextFileSync(log_file, log_entry + "\n", { append: true });

	if (!silent) {
		console.log(log_entry);
	}
}