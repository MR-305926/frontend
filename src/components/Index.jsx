//@ts-check

import { Navigate } from "react-router";
import session from "../utils/session";

const toDashboard = <Navigate to={"/dashboard"} />;
const toSession = <Navigate to={"/session"} />;

function Index() {
	//TODO remove debugging code
	console.log(session);
	console.log(session.hasToken());

	let hasToken = session.hasToken();
	return hasToken ? toDashboard : toSession;
}

export default Index;