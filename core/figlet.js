import { text } from '../deno-figlet/mod.js';

export async function write_title(title) {
	let _figlet = await text(`$ ${title}`, "speed", null);
	console.log(_figlet);
}