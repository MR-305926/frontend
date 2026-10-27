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
	function goHome() { navigate("/") }
	/**
	 * @type {import("react").SubmitEventHandler<HTMLFormElement>}
	 */
	return function (event) {
		event.preventDefault();
		let form = event.target;
		let data = new FormData(form);
		session.postResource(resourceUrl, undefined, data).
			then(session.setToken).
			then(goHome).
			catch(failureCallback);
	}
}

function generateContent() {
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

function SystemAccessUI() {
	return (
		session.hasToken() ?
			redirect :
			generateContent()
	);
}


export default SystemAccessUI;