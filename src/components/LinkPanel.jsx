//@ts-check

import { useNavigate } from "react-router";

/**
 * [0]: label, [1]: url
 */
function useLinkFactory() {
	let navigate = useNavigate();
	/**
	 * @param {string[]} param
	 */
	return function (param) {
		return <button onClick={() => navigate(param[1])}>{param[0]}</button>
	}
}

//TODO get from backend endpoint
/**
 * [0]: label, [1]: url
 * @returns {string[][]}
 */
function getExternalLinks() {
	let ans = [[""]];
	ans.pop();
	return ans;
}

/**
 * @param {Object} props
 * @param {() => void} props.logout
 */
function LinkPanel({ logout }) {
	let linkFactory = useLinkFactory();
	//WARN assumes that it is child of dashboard & dashboard watches out for null sessions
	let externalLinks = getExternalLinks();
	return (
		<aside id="asideLeft">
			<button onClick={logout}>⍈</button>
			{externalLinks.map(linkFactory)}
		</aside>
	);
}

export default LinkPanel;