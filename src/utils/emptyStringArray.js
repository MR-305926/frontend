//@ts-check

const emptyStringArrayPrototype = (() => {
	let a = [""]; a.pop(); return a;
})();

function emptyStringArray() {
	return structuredClone(emptyStringArrayPrototype);
}

export default emptyStringArray;