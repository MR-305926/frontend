//@ts-check

import readEnv, { ENVKEY } from "./readEnv.js";

const tokenKey = readEnv(ENVKEY.token_key);

/**
 * @param {Object | undefined} body
 */
function bodyStringify(body) {
	let wrongString = JSON.stringify(body);
	//TODO cleanup
	wrongString = wrongString.
		slice(1, wrongString.length - 1).
		//replaceAll("\":", ":").
		//replaceAll(",\"", ",").
		//replaceAll("{\"", "{").
		replaceAll("\\\"", "\"");
	return wrongString;
}

class SessionManager {
	constructor() { }

	/**
	 * @param {string} token
	 */
	setToken(token) {
		//TODO remove temp debug code
		//WARN temp debug code
		console.log(token);

		sessionStorage.setItem(tokenKey, token);
	}
	#getToken() {
		return sessionStorage.getItem(tokenKey);
	}
	clearSession() {
		sessionStorage.clear();
	}
	hasToken() {
		return this.#getToken() != null;
	}

	apiOrigin() {
		return readEnv(ENVKEY.api_origin);
	}
	apiIsHealthy() {
		return new Promise((resolve) => {
			fetch(this.apiOrigin()).
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
					actualHeaders.set("Authorization", token);
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
					(response) => response.ok ? response.json() : reject(),
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
					actualHeaders.set("Authorization", token);
				}
			}

			let actualBody = bodyStringify(body);

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
					(response) => response.ok ? response.json() : reject(),
					rejector
				).
				then(
					resolve,
					rejector
				);
		});
	}
}

const fetchForMe = new SessionManager();

export default fetchForMe;

