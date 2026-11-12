//@ts-check

import { Outlet } from "react-router";

/**
 * @param {Object} props
 * @param {boolean} props.formDisplayState
 * @param {unknown} props.formContext
 */
function FormPanel({ formDisplayState, formContext }) {
	return (
		<div style={{ display: formDisplayState ? "contents" : "none" }}>
			<aside id="asideRight">
				<Outlet context={formContext} />
			</aside>
		</div>
	);
}

export default FormPanel;