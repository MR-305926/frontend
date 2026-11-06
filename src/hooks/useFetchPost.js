//@ts-check

import session from "../utils/session.js";
import { useEffect, useState } from "react";

/**
 * @param {string} url
 * @param {Object} [body]
 * @param {{[k:string]:string}} [headers]
 * @returns {{isLoading:boolean,data:any,error:any}}
 */
function useFetchPost(url, body, headers) {
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState();
	const [error, setError] = useState();

	useEffect(() => {
		let ignore = false
		setIsLoading(true)
		session.postResource(url, body, headers).
			then((d) => {
				if (!ignore) {
					setData(d)
					setError(undefined)
				}
			})
			.catch((e) => {
				if (!ignore) {
					setError(e)
					setData(undefined)
				}
			})
			.finally(() => {
				if (!ignore) {
					setIsLoading(false)
				}
			})
		return () => {
			ignore = true
		}
	}, []);

	return { isLoading, data, error };
}

export default useFetchPost;