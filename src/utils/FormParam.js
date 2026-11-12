//@ts-check

import Joi from "joi";
import PaginationState from "./PaginationState";

const JoiTypes = Joi.types();

/**@typedef {{[name:string]:{alias:string,type:string,rules:{[k:string]:any}}}} FormSchema */

/**
 * @param {FormSchema} rawSchema
 * @returns {import("joi").ObjectSchema}
 */
function parseSchema(rawSchema) {
	let fieldSchema;
	let partialSchema = Object({});
	for (let [name, constraints] of Object.entries(rawSchema)) {
		//WARN magic read
		// @ts-ignore
		fieldSchema = JoiTypes[constraints.type];
		for (let [rule, param] of Object.entries(constraints.rules)) {
			if (param != undefined) {
				if (param != null) {
					fieldSchema = fieldSchema[rule](param);
				} else {
					fieldSchema = fieldSchema[rule]();
				}
			}
		}
		partialSchema[name] = fieldSchema.label(constraints.alias);
	}
	return Joi.object(partialSchema);
}

/**
 * @param {FormSchema} schema
 */
function genFields(schema) {
	let ans = [];
	let type;
	for (let [name, constraints] of Object.entries(schema)) {
		//TODO maybe don't trust Hapi.dev's judgment so much?
		//WARN assumes that the input type and corresponding joi schema type match in name
		switch (constraints.type) {
			case "string": type = "text"; break;
			default: type = constraints.type;
		}
		ans.push({ alias: constraints.alias, name: name, type: type });
	}
	return ans;
}

class FormParam {
	#fields;
	#validator;
	#handler;
	/**
	 * @param {FormSchema} schema
	 * @param {(paginationState:PaginationState) => import("react-hook-form").SubmitHandler<import("react-hook-form").FieldValues, void>} handler
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