//@ts-check

/**
 * @typedef {{name:string,floor:number|undefined,roof:number|undefined,value:string|undefined}[]} QueryFilter
 */

class PaginationState {
	#pageSize;
	#pageIndex;

	/**
	 * @param {number} pageSize
	 * @param {number} pageIndex
	 */
	constructor(pageSize, pageIndex) {
		this.#pageSize = pageSize;
		this.#pageIndex = pageIndex;
	}

	get pageSize() {
		return this.#pageSize;
	}

	get pageIndex() {
		return this.#pageIndex;
	}
}

export default PaginationState;