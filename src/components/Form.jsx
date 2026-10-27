//@ts-check

import { useOutletContext } from "react-router";
import QueryState from "../utils/QueryState.js";
import FormInput from "./FormInput.jsx";

//TODO verify that dynamic forms work correctly

/**@typedef {{label:string,type:("string"|"number"),min:string,max:string,value:string}} FormFieldSchema */

/** @typedef {({name:string,}|{name:string,})} API_whereClause */

/**
 * @param {import("./FormInput.jsx").FormInputGetter[]} getters
 * @param {QueryState} queryState
 * @param {(value:QueryState) => void} updateQueryState
 */
function submitForm(getters, queryState, updateQueryState) {
	return function () {
		let selector = [];
		/** @type {import("../utils/QueryState.js").QueryFilter} */
		let where = [];
		let buffer;
		for (let item of getters) {
			buffer = item();
			if (buffer.isSelected) selector.push(buffer.name);
			if (buffer.type != 'number' && buffer.a) {
				where.push({ name: buffer.name, floor: undefined, roof: undefined, value: buffer.a });
			} else {
				where.push({ name: buffer.name, floor: Number(buffer.a), roof: Number(buffer.b), value: undefined });
			}
		}

		updateQueryState(new QueryState(queryState.pageSize, queryState.pageIndex, selector, where));
	}
}

/**
 * @type {import("react").SubmitEventHandler<HTMLFormElement>}
 */
function resetForm(event) {
	event.preventDefault();
	event.target.reset();
}

/**
 * @param {Object} props
 * @param {FormFieldSchema[]} props.fields
 */
function Form({ fields }) {
	//WARN: react-router magic
	// @ts-ignore
	const [queryState, updateQueryState] = useOutletContext();

	/** @type {import("./FormInput.jsx").FormInputGetter[]} */
	let getters = [];
	let elements = [];
	{
		let item;
		let buffer;
		for (let i = 0, length = fields.length; i < length; i++) {
			item = fields[i];
			buffer = <FormInput key={i} param={item} gettersPointer={getters} />;
			elements.push(buffer);
		}
	}

	return (
		<form onSubmit={resetForm}>
			{elements}
			<button type="submit">❌</button>
			<button type="button" onClick={submitForm(getters, queryState, updateQueryState)}>🟢</button>
		</form>
	);
}

export default Form;


