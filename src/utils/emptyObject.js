//@ts-check

function emptyObject() {
	/** @type {{[k:string|number|symbol]:any}} */
	let obj = Object({});
	return obj;
}

export default emptyObject;