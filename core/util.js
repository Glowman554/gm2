export function update_console_line(current, goal, text) {
	Deno.stdout.writeSync(new TextEncoder().encode("\r\x1b[K"));
	Deno.stdout.writeSync(new TextEncoder().encode(`[${current}/${goal}] ${text}`));
}

export function exists(path) {
	try {
		if (Deno.lstatSync(path).isFile) {
			return true;
		} else {
			return true;
		}
	} catch (e) {
		return false;
	}
}

export function update_console_line_raw(text) {
	Deno.stdout.writeSync(new TextEncoder().encode("\r\x1b[K"));
	Deno.stdout.writeSync(new TextEncoder().encode(`${text}`));
}
