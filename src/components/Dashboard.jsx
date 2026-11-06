//@ts-check

import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import emptyStringArray from "../utils/emptyStringArray.js";
import QueryState from "../utils/QueryState.js";
import session from "../utils/session.js";
import LinkPanel from "./LinkPanel.jsx";

/**
 * @param {import("react-router").NavigateFunction} navigate
 */
function useLogout(navigate) {
	return function () {
		session.clearSession();
		navigate("/session");
	}
}

/**
 * @param {Object} props
 * @param {number} props.defaultPageSize
 */
function Dashboard({ defaultPageSize }) {
	let navigate = useNavigate();
	//WARN LinkPanel assumes that it is child of dashboard & dashboard watches out for null sessions
	let logout = useLogout(navigate);
	useEffect(() => {
		if (!session.hasToken()) {
			//TODO debug
			console.log("NO TOKEN FOUND");

			logout();
		}
	});
	const [queryState, updateQueryState] = useState(new QueryState(defaultPageSize, 1, emptyStringArray()));

	const [linkPanelDisplayState, linkPanelSetDisplayState] = useState(true);
	function toggleNav() { linkPanelSetDisplayState(!linkPanelDisplayState); }

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
				<button id="toggleAside" onClick={toggleNav}>{linkPanelDisplayState ? "<" : ">"}</button>
				<div>
					<button onClick={pageIndexBackward}>{"⇐"}</button>

					<input name="pageIndex" type="number" min={1} value={queryState.pageIndex} onChange={updatePageIndex} />
					<label htmlFor="pageCount">#</label>
					<input name="pageCount" type="number" min={1} value={queryState.pageSize} onChange={updatePageSize} />

					<button onClick={pageIndexForward}>{"⇒"}</button>
				</div>
				<button id="toggleForm" onClick={toggleForm}>{formDisplayState ? ">" : "<"}</button>
			</nav>
			<div>
				{linkPanelDisplayState ? <LinkPanel logout={logout} /> : ""}
				{content}
				{formDisplayState ? <aside id="asideRight"> <Outlet context={[queryState, updateQueryState]} /> </aside> : ""}
			</div>
		</>
	);
}

export default Dashboard;