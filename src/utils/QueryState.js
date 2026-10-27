//@ts-check

import session from "./session.js";

/**
 * @typedef {{name:string,floor:number|undefined,roof:number|undefined,value:string|undefined}[]} QueryFilter
 */

class QueryState {
	#pageSize;
	#pageIndex;
	#selector;
	#filter;

	/**
	 * @param {number} pageSize
	 * @param {number} pageIndex
	 * @param {string[]} [selector]
	 * @param {QueryFilter} [filter]
	 */
	constructor(pageSize, pageIndex, selector, filter) {
		this.#pageSize = pageSize;
		this.#pageIndex = pageIndex;
		this.#selector = selector;
		this.#filter = filter != undefined && filter.length < 1 ? undefined : filter;
	}

	get pageSize() {
		return this.#pageSize;
	}

	get pageIndex() {
		return this.#pageIndex;
	}

	getCopyOfSelector() {
		return structuredClone(this.#selector);
	}

	getCopyOfFilter() {
		return structuredClone(this.#filter);
	}

	/**
	 * 
	 * @param {string} url 
	 * @param {{[k:string]:string}} [headers]
	 */
	dispatch(url, headers) {
		let body = {};
		if (this.#selector != undefined) body["selector"] = this.#selector;
		if (this.#filter != undefined) body["where"] = this.#filter;
		body["skip"] = this.#pageIndex * this.#pageSize;
		body["amount"] = this.pageSize;

		if (headers == undefined) {
			headers = { "Content-Type": "application/json" };
		} else {
			headers["Content-Type"] = "application/json";
		}
		session.postResource(url, headers, JSON.stringify(body));
	}
}

export default QueryState;