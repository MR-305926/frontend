//@ts-check

import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import emptyStringArray from "../utils/emptyStringArray.js";
import QueryState from "../utils/QueryState.js";
import session from "../utils/session.js";

/**
 * @param {Object} props
 * @param {number} props.defaultPageSize
 */
function Dashboard({ defaultPageSize }) {
	{
		let navigate = useNavigate();
		if (!session.hasToken()) navigate("/session");
	}

	const [queryState, updateQueryState] = useState(new QueryState(defaultPageSize, 1, emptyStringArray()));

	const [linkerDisplayState, linkerSetDisplayState] = useState(true);
	function toggleAside() { linkerSetDisplayState(!linkerDisplayState); }

	const [formDisplayState, formSetDisplayState] = useState(true);
	function toggleForm() { formSetDisplayState(!formDisplayState); }

	/**
	 * @param {import("react").ChangeEvent<HTMLInputElement, HTMLInputElement>} event
	 */
	function updatePageIndex(event) {
		updateQueryState(new QueryState(queryState.pageSize, event.target.valueAsNumber));
	}

	/**
	 * @param {import("react").ChangeEvent<HTMLInputElement, HTMLInputElement>} event
	 */
	function updatePageSize(event) {
		updateQueryState(new QueryState(event.target.valueAsNumber, queryState.pageIndex));
	}

	function pageIndexForward() {
		updateQueryState(new QueryState(
			queryState.pageSize,
			queryState.pageIndex + 1,
			queryState.getCopyOfSelector(),
			queryState.getCopyOfFilter()
		));
	}

	function pageIndexBackward() {
		updateQueryState(new QueryState(
			queryState.pageSize,
			queryState.pageIndex > 1 ? queryState.pageIndex - 1 : 1
		));
	}

	const content = <div></div>;//TODO Table({queryState})

	return (
		<>
			<nav>
				<button id="toggleAside" onClick={toggleAside}>{linkerDisplayState ? "<" : ">"}</button>
				<div>
					<button onClick={pageIndexBackward}>{"⇐"}</button>

					<input name="pageIndex" type="number" min={1} value={queryState.pageIndex} onChange={updatePageIndex} />
					<label htmlFor="pageCount">#</label>
					<input type="number" min={1} value={queryState.pageSize} onChange={updatePageSize} />

					<button onClick={pageIndexForward}>{"⇒"}</button>
				</div>
				<button id="toggleForm" onClick={toggleForm}>{formDisplayState ? ">" : "<"}</button>
			</nav>
			<div>
				{linkerDisplayState ? <aside id="asideLeft">Hello world!</aside> : ""}
				{content}
				{formDisplayState ? <aside id="asideRight"> <Outlet context={[queryState, updateQueryState]} /> </aside> : ""}
			</div>
		</>
	);
}

export default Dashboard;