//@ts-check

import Joi from "joi";
import PaginationState from "./PaginationState";

/**@enum {string} */
const FieldType = {
	TEXT: "text",
	PASSWORD: "password",
	NUMBER: "number",
	DATE: "date",
	CHECKBOX: "checkbox"
};

/** @typedef {{[name:string]:{alias:string,type:FieldType,rules?:(import("joi").AnySchema)}}} FormSchema */
/** @typedef {(session:import("../utils/SessionManager").default, paginationState:PaginationState, consumer:import("react").Dispatch<import("react").SetStateAction<{headersAlias:{[k:string]:string},data:{[k:string]:string}[]}>>,navigate:import("react-router").NavigateFunction,setFormDisabled:import("react").Dispatch.<import("react").SetStateAction<boolean>>) => import("react-hook-form").SubmitHandler<import("react-hook-form").FieldValues, void>} FormParamHandler */

/**
 * @param {FormSchema} rawSchema
 * @returns {import("joi").ObjectSchema}
 */
function parseSchema(rawSchema) {
	let partialSchema = Object({});
	let rules;
	for (let [name, constraints] of Object.entries(rawSchema)) {
		rules = constraints.rules;
		if (rules == undefined) rules = Joi.boolean().default(false);
		partialSchema[name] = rules.label(constraints.alias);
	}
	return Joi.object(partialSchema);
}

/**
 * @param {FormSchema} schema
 */
function genFields(schema) {
	let ans = [];
	for (let [name, constraints] of Object.entries(schema)) {
		ans.push({ alias: constraints.alias, name: name, type: constraints.type });
	}
	return ans;
}

class FormParam {
	#fields;
	#validator;
	#handler;
	/**
	 * @param {FormSchema} schema
	 * @param {FormParamHandler} handler
	 */
	constructor(schema, handler) {
		this.#validator = parseSchema(schema);
		this.#fields = genFields(schema);
		this.#handler = handler;
	}

	schema() {
		return this.#validator;
	}

	fields() {
		return this.#fields;
	}

	handler() {
		return this.#handler;
	}
}

export default FormParam;
export { FieldType };