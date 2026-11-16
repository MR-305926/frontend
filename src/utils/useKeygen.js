//@ts-check

function useKeygen() {
	let index = Number.MIN_SAFE_INTEGER;
	return function () {
		let id = (new Date().toISOString()).concat((index++).toString());

		//TODO remove temp debug dump
		console.log(id);

		return id;
	}
}

export default useKeygen;