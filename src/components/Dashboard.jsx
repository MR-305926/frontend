//@ts-check

import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import PaginationState from "../utils/PaginationState.js";
import FormParam from "../utils/FormParam.js";
import LinkPanel from "./LinkPanel.jsx";
import { useQuery } from "@tanstack/react-query";
import DashboardNav from "./DashboardNav.jsx";
import FormPanel from "./FormPanel.jsx";

/**
 * @param {import("react-router").NavigateFunction} navigate
 * @param {import("../utils/SessionManager.js").default} session
 */
function useLogout(navigate, session) {
	return function () {
		session.clearSession();
		navigate("/session");
	}
}

/**
 * @param {import("../utils/SessionManager.js").default} session
 */
function useFetchLinkData(session) {
	let url = session.apiOrigin() + "/index";
	let action = (() => session.postResource(url));
	return useQuery({
		queryKey: [url],
		queryFn: action,
	});
}

/**
 * @param {Object} props
 * @param {import("../utils/SessionManager.js").default} props.session
 * @param {number} props.defaultPageSize
 */
function Dashboard({ session, defaultPageSize }) {
	//WARN LinkPanel assumes that it is child of dashboard & dashboard watches out for null sessions
	let logout = useLogout(useNavigate(), session);

	const [paginationState, updatePaginationState] = useState(new PaginationState(defaultPageSize, 1));
	const [formParam, updateFormParam] = useState(new FormParam({}, () => () => { return; }));

	const [linkPanelDisplayState, linkPanelSetDisplayState] = useState(true);
	function toggleLinkPanel() { linkPanelSetDisplayState(!linkPanelDisplayState); }

	const [formDisplayState, formSetDisplayState] = useState(true);
	function toggleForm() { formSetDisplayState(!formDisplayState); }

	let queryFetchLinkData = useFetchLinkData(session);

	const content = <div></div>;//TODO Table({blah})

	return (
		!session.hasToken() ?
			<Navigate to={"/session"} /> :
			<>
				<DashboardNav paginationState={paginationState} updatePaginationState={updatePaginationState} linkPanelDisplayState={linkPanelDisplayState} toggleLinkPanel={toggleLinkPanel} formDisplayState={formDisplayState} toggleForm={toggleForm} />
				<div>
					<LinkPanel visible={linkPanelDisplayState} queryFetchLinks={queryFetchLinkData} formParam={formParam} updateFormParam={updateFormParam} logout={logout} />
					{content}
					<FormPanel formDisplayState={formDisplayState} formContext={{ paginationState }} />
				</div>
			</>
	);
}

export default Dashboard;