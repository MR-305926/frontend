//@ts-check

const emptyObjectArrayPrototype = (() => {
	/** @type {{[k:string|number|symbol]:any}} */
	let obj = Object({});
	let a = [obj];
	a.pop();
	return a;
})();

function emptyObjectArray() {
	return structuredClone(emptyObjectArrayPrototype);
}

export default emptyObjectArray;