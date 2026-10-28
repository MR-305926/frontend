//@ts-check

import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "./components/Dashboard";
import Form from "./components/Form.jsx";
import Index from "./components/Index.jsx";
import SystemAccessUI from "./components/SystemAccessUI.jsx";

function WebApp() {
	//TODO proper error component
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Index />} />
				<Route path="session" element={<SystemAccessUI />} />
				<Route path="error" element={<p>An unexpected error has been found</p>} />
				<Route path="dashboard" element={<Dashboard defaultPageSize={10} />}>
					<Route path="test" element={<Form fields={[{ label: "a", type: "string", min: "0", max: "20", value: "" }]} />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default WebApp;
