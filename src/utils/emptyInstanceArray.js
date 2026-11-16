//@ts-check

/**
 * @template T
 * @param {T} prototype
 */
function emptyInstanceArray(prototype) {
	let a = [prototype];
	a.pop();
	return a;
}

export default emptyInstanceArray;