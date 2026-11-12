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
				alias: "Mostrar ISBN",
				type: FieldType.CHECKBOX,
			},
			"isbn": {
				alias: "ISBN",
				type: FieldType.TEXT,
				rules: Joi.string().allow("")
			},
			"_title": {
				alias: "Mostrar Titulo",
				type: FieldType.CHECKBOX
			},
			"title": {
				alias: "Titulo",
				type: FieldType.TEXT,
				rules: Joi.string().allow("")
			},
			"pageCountMin": {
				alias: "Cantidad de paginas minimo",
				type: FieldType.NUMBER,
				rules: Joi.alternatives(Joi.number(), Joi.any())
			},
			"pageCountMax": {
				alias: "Cantidad de paginas maximo",
				type: FieldType.NUMBER,
				rules: Joi.alternatives(
					Joi.when("pageCountMin", {
						is: Joi.exist(),
						then: Joi.number().min(Joi.ref("floor")),
						otherwise: Joi.number()
					}),
					Joi.any()
				)
			}
		},
		wrapHandler((session, paginationState, data, consumer) => {
			let selector = [];
			/** @type {({name:string,floor?:number,roof?:number,value?:string})[]} */
			let where = [];
			for (let [k, v] of Object.entries(data)) {
				switch (k) {
					case "_isbn": if (v) selector.push("isbn"); break;
					case "isbn": if (v) where.push({ name: "isbn", value: v }); break;
					case "_title": if (v) selector.push("title"); break;
					case "title": if (v) where.push({ name: "title", value: v }); break;
					case "pageCountMin": if (v) {
						let value;
						value = where.find((a) => a.name == "pageCount")
						if (!value) {
							value = { name: "pageCount" };
							where.push(value);
						}
						value["floor"] = Number(v);
					} break;
					case "pageCountMax": if (v) {
						let value;
						value = where.find((a) => a.name == "pageCount")
						if (!value) {
							value = { name: "pageCount" };
							where.push(value);
						}
						value["roof"] = Number(v);
					} break;
					default: continue;
				}
			}
			let skip = paginationState.pageSize * (paginationState.pageIndex - 1);
			let amount = paginationState.pageSize;

			let body = Object();
			if (selector.length > 0) body["selector"] = selector;
			if (where.length > 0) body["where"] = where;
			if (skip > 0) body["skip"] = skip;
			body["amount"] = amount;

			session.postResource(session.apiOrigin() + "/bookGet", body).then(
				(value) => consumer(value.value),
				doNothing
			);
		})
	)
};

export default formDictionary;