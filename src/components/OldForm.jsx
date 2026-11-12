//@ts-check

import { useNavigate, useOutletContext } from "react-router";
import PaginationState from "../utils/PaginationState.js";
import FormInput from "./OldFormInput.jsx";
import { useState } from "react";

//TODO verify that dynamic forms work correctly

/**@typedef {{label:string,type:("string"|"number"),min:string,max:string,value:string}} FormFieldSchema */

/** @typedef {({name:string,}|{name:string,})} API_whereClause */

/**
 * @param {import("../utils/SessionManager.js").default} session
 * @param {import("./OldFormInput.jsx").FormInputGetter[]} getters
 * @param {PaginationState} paginationState
 * @param {(value:PaginationState) => void} updatePaginationState
 * @param {(formDisabled:boolean) => void} setFormDisabled
 */
function useSubmitForm(session, getters, paginationState, updatePaginationState, setFormDisabled) {
	let navigate = useNavigate();

	/** @type {import("react").SubmitEventHandler<HTMLInputElement>} */
	return async function (event) {
		event.preventDefault();
		event.stopPropagation();
		setFormDisabled(true);
		if (await session.apiIsHealthy()) {
			let selector = [];
			/** @type {import("../utils/PaginationState.js").QueryFilter} */
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

			updatePaginationState(new PaginationState(paginationState.pageSize, paginationState.pageIndex));
			setFormDisabled(false);
		} else {
			setFormDisabled(false);
			navigate("/error");
		}
	}
}

/**
 * @param {(formDisabled:boolean) => void} setFormDisabled
 */
function resetForm(setFormDisabled) {
	/**
	 * @type {import("react").SubmitEventHandler<HTMLFormElement>}
	 */
	return function (event) {
		event.preventDefault();
		setFormDisabled(true);
		event.target.reset();
		setFormDisabled(false);
	}
}

/**
 * @param {Object} props
 * @param {import("../utils/SessionManager.js").default} props.session
 * @param {FormFieldSchema[]} props.fields
 */
function Form({ session, fields }) {
	//WARN: react-router magic
	// @ts-ignore
	const [paginationState, updatePaginationState] = useOutletContext();
	const [formDisabled, setFormDisabled] = useState(false);

	/** @type {import("./OldFormInput.jsx").FormInputGetter[]} */
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

	let submitForm = useSubmitForm(session, getters, paginationState, updatePaginationState, setFormDisabled);

	//TODO debug
	//WARN: submitForm stops propagation, only the reset form button propagates towards the reset form function
	let ans = (
		<form onSubmit={resetForm(setFormDisabled)}>
			<fieldset disabled={formDisabled}>
				{elements}
				<input type="submit">❌</input>
				<input type="submit" onSubmit={submitForm}>🟢</input>
			</fieldset>
		</form>
	);

	return ans;
}

export default Form;


