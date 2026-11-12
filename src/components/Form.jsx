//@ts-check

import { joiResolver } from "@hookform/resolvers/joi";
import FormParam from "../utils/FormParam";
import { useForm } from "react-hook-form";
import spaJoi from "../assets/spaJoi.js";
import { useContext } from "react";
import { useOutletContext } from "react-router";
import PaginationState from "../utils/PaginationState.js";

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
				<input key={"input_" + input.name} type={input.type} {...register(input.name)} />
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

	//WARN react router magic
	/** 
	 * @type {{paginationState:PaginationState}}
	 */
	let { paginationState } = useOutletContext();
	let handler = param.handler()(paginationState);

	return (
		<form onSubmit={handleSubmit(handler)}>
			{param.fields().map(fieldFactory)}
			<button type={"submit"}>⌯⌲</button>
		</form>
	)
}

export default Form;