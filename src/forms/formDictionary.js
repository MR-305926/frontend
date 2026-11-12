//@ts-check

import Joi from "joi";
import FormParam, { FieldType } from "../utils/FormParam";
import { doNothing } from "../utils/constFunction.js";

/**
 * @param {(session:import("../utils/SessionManager").default,paginationState:import("../utils/PaginationState").default,data:import("react-hook-form").FieldValues,consumer:import("react").Dispatch<import("react").SetStateAction<Record<string,string>[]>>)=>void} handler 
 */
function wrapHandler(handler) {
	/**
	 * @param {import("../utils/SessionManager").default} session
	 * @param {import("../utils/PaginationState").default} paginationState
	 * @param {import("react").Dispatch<import("react").SetStateAction<Record<string,string>[]>>} consumer
	 */
	return function (session, paginationState, consumer) {
		/**
		 * @param {import("react-hook-form").FieldValues} data
		 */
		return function (data) {
			handler(session, paginationState, data, consumer);
		}
	}
}

/**
 * @type {{[k:string]:import("../utils/FormParam").default}}
 */
const formDictionary = {
	"bookGet": new FormParam(
		{
			"_isbn": {
				alias: "Show ISBN",
				type: FieldType.CHECKBOX,
			},
			"isbn": {
				alias: "ISBN",
				type: FieldType.TEXT,
				rules: Joi.string().allow("")
			},
		},
		wrapHandler((session, paginationState, data, consumer) => {
			let selector = [];
			let where = [];
			for (let [k, v] of Object.keys(data)) {
				switch (k) {
					case "_isbn": selector.push("isbn"); break;
					case "isbn": if (v) where.push({ name: "isbn", value: v }); break;
					default: continue;
				}
			}
			let skip = paginationState.pageSize * paginationState.pageIndex;
			let amount = paginationState.pageSize;

			let body = Object();
			if (selector.length > 0) body["selector"] = selector;
			if (where.length > 0) body["where"] = where;
			body["skip"] = skip;
			body["amount"] = amount;

			session.postResource(session.apiOrigin() + "/bookGet", body).then(
				(value) => consumer(value.value),
				doNothing
			);
		})
	)
};

export default formDictionary;