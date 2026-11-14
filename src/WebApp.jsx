//@ts-check

import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "./components/Dashboard";
import Form from "./components/Form.jsx";
import Index from "./components/Index.jsx";
import SystemAccessUI from "./components/SystemAccessUI.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FormParam from "./utils/FormParam.js";
import formDictionary from "./forms/formDictionary.js";

const queryClient = new QueryClient();

/**
 * @param {string} alias
 * @param {string} type
 * @param {{ [k:string]:any }} rules
 */
function field(alias, type, rules) {
	return { alias, type, rules };
}

/**
 * @param {Object} props
 * @param {import("./utils/SessionManager.js").default} props.session
 */
function WebApp({ session }) {
	let routes = Object.
		keys(formDictionary).
		map((k) => {
			return <Route path={k} element={<Form param={formDictionary[k]} />} />
		});
	//TODO proper error component
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route index element={<Index session={session} />} />
					<Route path="session" element={<SystemAccessUI session={session} />} />
					<Route path="error" element={<p>An unexpected error has been found</p>} />
					<Route path="dashboard" element={<Dashboard session={session} defaultPageSize={10} />}>
						<Route path="" element={<p>Seleccione una acción en el panel desplegable de la izquierda</p>} />
						{routes}
					</Route>
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default WebApp;
