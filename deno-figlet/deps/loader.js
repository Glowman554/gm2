
// Font loader

import standart_font from '../dist/fonts/_speed.js';
import { debug_log } from '../../core/logger.js';

export default async (name, cb) => {

	
	let fileName = `_${name.replace(/[^a-zA-Z0-9]/g,'_')}`; 
	
	let font;
	try {
		font = await import(`../dist/fonts/${fileName}.js`);
		font = font.default.font;
	} catch (error) {
		debug_log(`Fail to load font ${fileName}. Reason: ${error}`);
		debug_log(`Loading standart font`);
		font = standart_font.font;
	}


	if (cb && typeof cb == "function") {
		return cb(font);
	}
	return font;
}