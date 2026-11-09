//@ts-check

import { Navigate, useNavigate } from "react-router";
import SESSION from "../utils/SESSION.js";
import { useQuery } from "@tanstack/react-query";

const externalLinksUrl = SESSION.apiOrigin() + "/index";

function useLinkFactory() {
	let navigate = useNavigate();
	/**
	 * @param {{label:string,path:string}} param
	 */
	return function (param) {
		return (<li><button onClick={() => navigate(param.path)}>{param.label}</button></li>);
	}
}

function fetchLinks() {
	return SESSION.postResource(externalLinksUrl);
}

function Links() {
	let linkFactory = useLinkFactory();

	let { data, error, isPending } = useQuery({
		queryKey: [externalLinksUrl],
		queryFn: fetchLinks,
	});

	if (isPending) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;
	return (
		isPending ? <p>Loading...</p> :
			error != null ? <Navigate to={"/error"} /> :
				data.map(linkFactory)
	);
}

//TODO get links from backend endpoint
/**
 * @param {Object} props
 * @param {() => void} props.logout
 */
function LinkPanel({ logout }) {
	//WARN assumes that it is child of dashboard & dashboard watches out for null sessions

	let links = <Links />;

	return (
		<aside id="asideLeft">
			<ul>
				<li>
					<button onClick={logout}>⍈</button>
				</li>
				{links}
			</ul>
		</aside>
	);
}

export default LinkPanel;