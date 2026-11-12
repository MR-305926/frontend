//@ts-check

import { Navigate, useNavigate } from "react-router";

function useLinkFactory() {
	let navigate = useNavigate();
	/**
	 * @param {{label:string,innerPath:string,schema:import("../utils/FormParam.js").FormSchema,path:string}} param
	 */
	return function (param) {
		let target = "/dashboard/" + param.innerPath;
		return (<li key={"li_linkto_" + param.innerPath}><button key={"btn_linkto_" + param.innerPath} onClick={() => navigate(target)}>{param.label}</button></li>);
	}
}

/**
 * @param {Object} props
 * @param {any} props.data
 * @param {Error|null} props.error
 * @param {boolean} props.isPending
 * @param {import("../utils/FormParam.js").default} props.formParam
 * @param {import("react").Dispatch<import("react").SetStateAction<import("../utils/FormParam.js").default>>} props.updateFormParam
 */
function Links({ data, error, isPending }) {
	let linkFactory = useLinkFactory();

	if (isPending) {
		return <p>Loading...</p>;
	} else if (error) {
		return <p>Error: {error.message}</p>;
	}
	//else
	return (data.map(linkFactory));
}

//TODO get links from backend endpoint
/**
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {import("@tanstack/react-query").UseQueryResult<any,Error>} props.queryFetchLinks
 * @param {import("../utils/FormParam.js").default} props.formParam
 * @param {import("react").Dispatch<import("react").SetStateAction<import("../utils/FormParam.js").default>>} props.updateFormParam
 * @param {() => void} props.logout
 */
function LinkPanel({ visible, queryFetchLinks, formParam, updateFormParam, logout }) {
	//WARN assumes that it is child of dashboard & dashboard watches out for null sessions
	let { data, error, isPending } = queryFetchLinks;

	return (
		<div style={{ display: visible ? "contents" : "none" }}>
			<aside id="asideLeft">
				<ul>
					<li><button onClick={logout}>⍈</button></li>
					<Links data={data} error={error} isPending={isPending} formParam={formParam} updateFormParam={updateFormParam} />
				</ul>
			</aside>
		</div>
	);
}

export default LinkPanel;