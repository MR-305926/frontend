//@ts-check

import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import session from "../utils/session.js";

const redirect = <Navigate to={"/dashboard"} />;
const usernameKey = "username";
const passwordKey = "password";

const loginResourceUrl = session.apiOrigin() + "/login";
const loginFormContent = (
	<>
		<input name={usernameKey} type="text" placeholder="usuario" />
		<input name={passwordKey} type="password" placeholder="contrasenia" />
		<input type="submit" value={"🔓"} />
	</>
);
const loginFormFailTag = <p>🗝❌🔒</p>

const signUpResourceUrl = session.apiOrigin() + "/signUp";
const signUpFormContent = (
	<>
		<input name={usernameKey} type="text" placeholder="usuario" />
		<input name={passwordKey} type="password" placeholder="contrasenia" />
		<input type="submit" value={"📝"} />
	</>
);
const signUpFormFailTag = <p>❌📝↔️📝</p>;

/**
 * @param {string} resourceUrl
 * @param {(reason: any) => void} failureCallback
 */
function useSessionManagementResource(resourceUrl, failureCallback) {
	let navigate = useNavigate();
	function goHome() { navigate("/"); }
	/**
	 * @param {import("react").SubmitEvent<HTMLFormElement>} event
	 */
	function solver(event) {
		let form = event.target;
		let formdata = new FormData(form);
		let data = JSON.stringify({
			[usernameKey]: formdata.get(usernameKey),
			[passwordKey]: formdata.get(passwordKey)
		});
		session.postResource(resourceUrl, data).
			then(session.setToken).
			then(goHome).
			catch(failureCallback);
	}

	/**
	 * @type {import("react").SubmitEventHandler<HTMLFormElement>}
	 */
	return async function (event) {
		event.preventDefault();
		let sessionIsHealthy = await session.apiIsHealthy();
		if (sessionIsHealthy) {
			solver(event);
		} else {
			navigate("/error");
		}
	}
}

function generateContent() {
	return function () {
		const [loginFailed, setLoginFailed] = useState(false);
		const submitLoginAction = useSessionManagementResource(loginResourceUrl, () => setLoginFailed(true));
		const [signUpFailed, setSignUpFailed] = useState(false);
		const submitSignUpAction = useSessionManagementResource(signUpResourceUrl, () => setSignUpFailed(true));

		return (
			<div className="half">
				<form onSubmit={submitLoginAction}>
					{loginFormContent}
					{loginFailed && loginFormFailTag}
				</form>
				<form onSubmit={submitSignUpAction}>
					{signUpFormContent}
					{signUpFailed && signUpFormFailTag}
				</form>
			</div>
		);
	}
}

function SystemAccessUI() {
	return (
		session.hasToken() ?
			redirect :
			generateContent()()
	);
}


export default SystemAccessUI;