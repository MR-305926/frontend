//@ts-check

import readEnv, { ENVKEY } from "./readEnv.js";

const tokenKey = readEnv(ENVKEY.token_key);

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

	/**
	 * @param {string} url
	 * @param {{[k:string]:string}} [headers]
	 */
	getResource(url, headers) {
		return new Promise((resolve, reject) => {
			function rejector() { reject(); }

			let token = this.#getToken();
			if (token != null) {
				if (headers != undefined) {
					headers["Authorization"] = token;
				} else {
					headers = { Authorization: token };
				}
			}

			fetch(url, { headers }).
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
	 * @param {{[k:string]:string}} [headers]
	 * @param {BodyInit} [body]
	 */
	postResource(url, headers, body) {
		return new Promise((resolve, reject) => {
			function rejector() { reject(); }

			let token = this.#getToken();
			if (token != null) {
				if (headers != undefined) {
					headers["Authorization"] = token;
				} else {
					headers = { Authorization: token };
				}
			}

			fetch(url, { headers, body }).
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

