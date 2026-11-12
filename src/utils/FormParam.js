//@ts-check

import Joi from "joi";
import PaginationState from "./PaginationState";

/**@enum {string} */
const FieldType = {
	TEXT: "text",
	NUMBER: "number",
	DATE: "date",
	CHECKBOX: "checkbox"
};

/** @typedef {{[name:string]:{alias:string,type:FieldType,rules?:(import("joi").AnySchema)}}} FormSchema */

/**
 * @param {FormSchema} rawSchema
 * @returns {import("joi").ObjectSchema}
 */
function parseSchema(rawSchema) {
	let partialSchema = Object({});
	let rules;
	for (let [name, constraints] of Object.entries(rawSchema)) {
		rules = constraints.rules;
		if (rules == undefined) rules = Joi.any();
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
	 * @param {(session:import("../utils/SessionManager").default, paginationState:PaginationState, consumer:import("react").Dispatch<import("react").SetStateAction<Record<string,string>[]>>) => import("react-hook-form").SubmitHandler<import("react-hook-form").FieldValues, void>} handler
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