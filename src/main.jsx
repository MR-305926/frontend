//@ts-check

// @ts-ignore
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import WebApp from "./WebApp.jsx";
import { SessionManagerInstance } from "./utils/SessionManager.js";

//WARN closure permits unloading of candidates when action target is found
{
	let rootCandidates = document.getElementsByTagName('main');
	if (rootCandidates.length == 1) {
		const main = rootCandidates.item(0);
		if (main != null) {
			init(main, SessionManagerInstance);
		}
	} else {
		if (rootCandidates.length > 1) {
			throw new Error("ONLY ONE HTML MAIN CONTENT AREA IS ALLOWED, UNABLE TO CREATE ROOT");
		}
		//else
		if (rootCandidates.length < 1) {
			throw new Error("NO HTML MAIN CONTENT AREA FOUND, UNABLE TO CREATE ROOT");
		}
	}
}

/**
 * @param {import("react-dom/client").Container} main
 * @param {import("./utils/SessionManager.js").default} session
 */
async function init(main, session) {
	createRoot(main).render(
		<StrictMode>
			<WebApp session={session} />
		</StrictMode>
	);
}