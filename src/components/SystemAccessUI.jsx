//@ts-check

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SESSION from "../utils/SESSION.js";

const usernameKey = "username";
const passwordKey = "password";

const loginResourceUrl = SESSION.apiOrigin() + "/login";
const loginFormContent = (
	<>
		<input name={usernameKey} type="text" placeholder="usuario" />
		<input name={passwordKey} type="password" placeholder="contrasenia" />
		<input type="submit" value={"🔓"} />
	</>
);
const loginFormFailTag = <p>🗝❌🔒</p>

const signUpResourceUrl = SESSION.apiOrigin() + "/signUp";
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
		let data = Object({
			[usernameKey]: formdata.get(usernameKey),
			[passwordKey]: formdata.get(passwordKey)
		});

		SESSION.postResource(resourceUrl, data).
			then((ans) => SESSION.setToken(ans.value)).
			then(goHome).
			catch(failureCallback);
	}

	/**
	 * @type {import("react").SubmitEventHandler<HTMLFormElement>}
	 */
	return async function (event) {
		event.preventDefault();
		let sessionIsHealthy = await SESSION.apiIsHealthy();
		if (sessionIsHealthy) {
			solver(event);
		} else {
			navigate("/error");
		}
	}
}

function SystemAccessUI() {
	let navigate = useNavigate();
	useEffect(() => {
		if (SESSION.hasToken()) {
			navigate("/dashboard");
		}
	});

	const [loginFailed, setLoginFailed] = useState(0);
	const submitLoginAction = useSessionManagementResource(loginResourceUrl, () => setLoginFailed(loginFailed + 1));
	const [signUpFailed, setSignUpFailed] = useState(0);
	const submitSignUpAction = useSessionManagementResource(signUpResourceUrl, () => setSignUpFailed(signUpFailed + 1));

	return (
		<div className="half">
			<form onSubmit={submitLoginAction}>
				<fieldset>
					{loginFormContent}
				</fieldset>
				{(loginFailed > 0 ? loginFormFailTag : "")}{(loginFailed > 1 ? "x" + loginFailed : "")}
			</form>
			<form onSubmit={submitSignUpAction}>
				<fieldset>
					{signUpFormContent}
				</fieldset>
				{(signUpFailed > 0 ? signUpFormFailTag : "")}{(signUpFailed > 1 ? "x" + signUpFailed : "")}
			</form>
		</div>
	);
}


export default SystemAccessUI;