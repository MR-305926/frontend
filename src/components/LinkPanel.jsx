//@ts-check

import { Navigate, useNavigate } from "react-router";
import session from "../utils/session.js";
import useFetchPost from "../hooks/useFetchPost.js";

function useLinkFactory() {
	let navigate = useNavigate();
	/**
	 * @param {{label:string,path:string}} param
	 */
	return function (param) {
		return <button onClick={() => navigate(param.path)}>{param.label}</button>
	}
}

const externalLinksUrl = session.apiOrigin() + "/index";

//TODO get links from backend endpoint
/**
 * @param {Object} props
 * @param {() => void} props.logout
 */
function LinkPanel({ logout }) {
	//WARN assumes that it is child of dashboard & dashboard watches out for null sessions
	let linkFactory = useLinkFactory();
	//TODO implement real querying
	let error = false;

	return (
		error ?
			<Navigate to={"/error"} /> :
			<aside id="asideLeft">
				<button onClick={logout}>⍈</button>
			</aside>
	);
}

export default LinkPanel;