//@ts-check

import { Navigate } from "react-router";

const toDashboard = <Navigate to={"/dashboard"} />;
const toSession = <Navigate to={"/session"} />;

/**
 * @param {Object} props
 * @param {import("../utils/SessionManager.js").default} props.session
 */
function Index({ session }) {
	let hasToken = session.hasToken();
	return hasToken ? toDashboard : toSession;
}

export default Index;