//@ts-check

/**
 * @enum {string}
 */
const ENVKEY = Object.freeze({
	"api_origin": "VITE_api_origin",
	"token_key": "VITE_token_key"
});

/**
 * @param {ENVKEY} key
 */
function readEnv(key) {
	/** @type {string | null | undefined} */
	//WARN import.meta.env => vite.js magic
	// @ts-ignore
	let ans = import.meta.env[key];
	if (ans == null || ans == undefined) {
		//WARN import.meta.env => vite.js magic
		// @ts-ignore
		throw new Error(`MISSING ENVIROMENT VARIABLE: ${key}\r\nENVIROMENT: ${Object.keys(import.meta.env)}`);
	}
	return ans;
}

export default readEnv;
export { ENVKEY };

