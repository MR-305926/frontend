//@ts-check

import { useState } from "react";

/** @typedef {{name:string,type:"string"|"number",isSelected:boolean,a:string,b:string|undefined}} FormInputValue */
/** @typedef {() => FormInputValue} FormInputGetter */

/**
 * @param {Object} props
 * @param {import("./Form").FormFieldSchema} props.param
 * @param {FormInputGetter[]} props.gettersPointer
 */
function FormInput({ param, gettersPointer }) {
	let a = "a";
	let b = "b";
	let c = "c";

	let formRowContent = [];
	{
		let getter;

		let checkSelect = <input key={c} type="checkbox" />;
		formRowContent.push(checkSelect);

		let [minMaximum, updateMinMaximum] = useState(param.max);
		if (param.type == 'number') {
			let fieldA = <input key={a} type={param.type} min={param.min} max={param.max} defaultValue={param.min} onChange={(event) => updateMinMaximum(event.target.max)} />;
			formRowContent.push(fieldA);
			let fieldB = <input key={b} type={param.type} min={minMaximum} max={param.max} defaultValue={minMaximum} />;
			formRowContent.push(fieldB);
			getter = () => {
				return {
					name: param.label,
					type: param.type,
					isSelected: checkSelect.props.value,
					a: fieldA.props.value,
					b: fieldB.props.value
				}
			};
		} else {
			let fieldA = <input key={a} type={param.type} minLength={Number(param.min)} maxLength={Number(param.max)} />;
			formRowContent.push(fieldA);
			getter = () => {
				return {
					name: param.label,
					type: param.type,
					isSelected: checkSelect.props.value,
					a: fieldA.props.value,
					b: undefined
				};
			}
		}

		gettersPointer.push(getter);
	}

	return (
		<div className="formRow" >
			<label>{param.label}</label>
			{formRowContent}
		</div>
	);
}

export default FormInput;