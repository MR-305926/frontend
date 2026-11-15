//@ts-check

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const usernameKey = "username";
const passwordKey = "password";

const loginFormContent = (
	<>
		<input name={usernameKey} type="text" placeholder="usuario" />
		<input name={passwordKey} type="password" placeholder="contraseña" />
		<input type="submit" value={"🔓"} />
	</>
);
const loginFormFailTag = <p>🗝❌🔒</p>

const signUpFormContent = (
	<>
		<input name={usernameKey} type="text" placeholder="usuario" />
		<input name={passwordKey} type="password" placeholder="contrasenia" />
		<input type="submit" value={"📝"} />
	</>
);
const signUpFormFailTag = <p>❌📝↔️📝</p>;

/**
 * @param {import("../utils/SessionManager.js").default} session
 * @param {string} resourceUrl
 * @param {(reason: any) => void} failureCallback
 */
function useSessionManagementResource(session, resourceUrl, failureCallback) {
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

		session.postResource(resourceUrl, data).
			then((ans) => session.setToken(ans.value)).
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

/**
 * @param {Object} props
 * @param {import("../utils/SessionManager.js").default} props.session
 */
function SystemAccessUI({ session }) {
	let navigate = useNavigate();
	useEffect(() => {
		if (session.hasToken()) {
			navigate("/dashboard");
		}
	});

	const loginResourceUrl = session.apiOrigin() + "/login";
	const [loginFailed, setLoginFailed] = useState(0);
	const submitLoginAction = useSessionManagementResource(session, loginResourceUrl, () => setLoginFailed(loginFailed + 1));
	const signUpResourceUrl = session.apiOrigin() + "/signUp";
	const [signUpFailed, setSignUpFailed] = useState(0);
	const submitSignUpAction = useSessionManagementResource(session, signUpResourceUrl, () => setSignUpFailed(signUpFailed + 1));

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