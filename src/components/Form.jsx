//@ts-check

import { joiResolver } from "@hookform/resolvers/joi";
import FormParam, { FieldType } from "../utils/FormParam";
import { useForm } from "react-hook-form";
import spaJoi from "../assets/spaJoi.js";
import { useOutletContext } from "react-router";
import PaginationState from "../utils/PaginationState.js";

/**@typedef {{session:import("../utils/SessionManager.js").default,paginationState:PaginationState, updatePaginationState:(value:import("../utils/PaginationState").default) => void,consumer:import("react").Dispatch<import("react").SetStateAction<{[k:string]:string}[]>>,navigate:import("react-router").NavigateFunction}} FormContext */

/**
 * @param {import("react-hook-form").FormState<import("react-hook-form").FieldValues>} formState
 * @param {import("react-hook-form").UseFormRegister<import("react-hook-form").FieldValues>} register
 */
function useFieldFactory(formState, register) {
	/** @param {{alias: string,name: string,type: string}} input */
	return function (input) {
		return (
			<>
				<label key={"label_" + input.name} htmlFor={input.name}>{input.alias}</label>
				{
					input.type == FieldType.CHECKBOX ?
						<input key={"input_" + input.name} type={input.type} value={input.type == FieldType.CHECKBOX ? "true" : ""} {...register(input.name)} /> :
						<input key={"input_" + input.name} type={input.type} {...register(input.name)} />
				}
				<p key={"warn_" + input.name}>{(formState.errors[input.name]?.message ?? "").toString()}</p>
			</>
		);
	}
}

/**
 * @param {Object} props
 * @param {FormParam} props.param
 */
function Form({ param }) {
	let { register, handleSubmit, formState } = useForm({
		resolver: joiResolver(param.schema(), {
			messages: spaJoi
		})
	});

	let fieldFactory = useFieldFactory(formState, register);


	//WARN react router magic, update on Dashboard.jsx
	/** 
	 * @type {FormContext}
	 */
	let { session, paginationState, updatePaginationState, consumer, navigate } = useOutletContext();
	let handler = param.handler()(session, paginationState, consumer, navigate);

	/**
	 * @param {import("react").ChangeEvent<HTMLInputElement, HTMLInputElement>} event
	 */
	function updatePageIndex(event) {
		updatePaginationState(new PaginationState(paginationState.pageSize, event.target.valueAsNumber));
	}

	/**
	 * @param {import("react").ChangeEvent<HTMLInputElement, HTMLInputElement>} event
	 */
	function updatePageSize(event) {
		updatePaginationState(new PaginationState(event.target.valueAsNumber, paginationState.pageIndex));
	}

	function pageIndexForward() {
		updatePaginationState(new PaginationState(
			paginationState.pageSize,
			paginationState.pageIndex + 1
		));
	}

	function pageIndexBackward() {
		updatePaginationState(new PaginationState(
			paginationState.pageSize,
			paginationState.pageIndex > 1 ? paginationState.pageIndex - 1 : 1
		));
	}

	return (
		<div>
			<form onSubmit={handleSubmit(handler)}>
				{param.fields().map(fieldFactory)}
				<button type={"submit"}>⌯⌲</button>
				<div>
					<button onClick={pageIndexBackward}>{"⇐"}</button>
					<input name="pageIndex" type="number" min={1} value={paginationState.pageIndex} onChange={updatePageIndex} />
					<label htmlFor="pageCount">#</label>
					<input name="pageCount" type="number" min={1} value={paginationState.pageSize} onChange={updatePageSize} />
					<button onClick={pageIndexForward}>{"⇒"}</button>
				</div>
			</form>
		</div>
	)
}

export default Form;