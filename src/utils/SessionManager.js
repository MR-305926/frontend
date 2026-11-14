//@ts-check

import readEnv, { ENVKEY } from "./readEnv.js";

/**
 * @param {Object} body
 */
function bodyStringify(body) {
	let value = JSON.stringify(body);
	//TODO cleanup
	value = value.
		//slice(1, value.length - 1).
		//replaceAll("\":", ":").
		//replaceAll(",\"", ",").
		//replaceAll("{\"", "{").
		replaceAll("\\\"", "\"");
	return value;
}

/**
 * @param {number} status
 */
function responseAllRight(status) {
	return (status > 199 && status < 300);
}

class SessionManager {
	/** @type {string|null} */
	#token;
	constructor() {
		this.#token = null;
	}

	/**
	 * @param {string} token
	 */
	setToken(token) {
		this.#token = token;
	}
	#getToken() {
		return this.#token;
	}
	clearSession() {
		this.#token = null;
		sessionStorage.clear();
	}
	hasToken() {
		return this.#getToken() != null;
	}

	apiOrigin() {
		return readEnv(ENVKEY.api_origin);
	}
	/** @returns {Promise<boolean>} */
	apiIsHealthy() {
		return new Promise((resolve) => {
			fetch(this.apiOrigin() + "/health", { method: "HEAD" }).
				then(
					(value) => resolve(value.ok),
					() => resolve(false)
				);
		});
	}

	/**
	 * @param {string} url
	 * @param {{[k:string]:string}} [headers]
	 */
	getResource(url, headers) {
		return new Promise((resolve, reject) => {
			function rejector() { reject(); }

			let actualHeaders = new Headers();
			{
				if (headers != undefined) {
					for (let [k, v] of Object.entries(headers)) {
						actualHeaders.set(k, v);
					}
				}
				actualHeaders.set("Content-Type", "application/json");
				let token = this.#getToken();
				if (token != null) {
					actualHeaders.set("Authorization", "Bearer " + token);
				}
			}

			fetch(
				url,
				{
					method: "GET",
					headers: actualHeaders
				}
			).
				then(
					(response) => responseAllRight(response.status) ? response.json() : reject(),
					rejector
				).
				then(
					resolve,
					rejector
				);
		});
	}

	/**
	 * @param {string} url
	 * @param {Object} [body]
	 * @param {{[k:string]:string}} [headers]
	 * @param {AbortSignal} [signal]
	 */
	postResource(url, body, headers, signal) {
		return new Promise((resolve, reject) => {
			let actualHeaders = new Headers();
			{
				if (headers != undefined) {
					for (let [k, v] of Object.entries(headers)) {
						actualHeaders.set(k, v);
					}
				}
				actualHeaders.set("Content-Type", "application/json");
				let token = this.#getToken();
				if (token != null) {
					actualHeaders.set("Authorization", "Bearer " + token);
				}
			}

			let actualBody = (body != undefined ? bodyStringify(body) : body);

			fetch(
				url,
				{
					method: "POST",
					headers: actualHeaders,
					body: actualBody,
					signal: signal
				}
			).
				then(
					(response) => {
						if (responseAllRight(response.status)) {
							if (response.status != 204) {
								response.json().then(
									(value) => resolve(value),
									(reason) => {
										console.error(response);
										reject(reason);
									}
								);
							} else {
								resolve({});
							}
						} else {
							reject(response)
						}
					},
					reject
				);
		});
	}
}

const SessionManagerInstance = new SessionManager();

export default SessionManager;
export { SessionManagerInstance };
