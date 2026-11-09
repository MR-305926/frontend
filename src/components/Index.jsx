//@ts-check

import { Navigate } from "react-router";
import SESSION from "../utils/SESSION.js";

const toDashboard = <Navigate to={"/dashboard"} />;
const toSession = <Navigate to={"/session"} />;

function Index() {
	let hasToken = SESSION.hasToken();
	return hasToken ? toDashboard : toSession;
}

export default Index;