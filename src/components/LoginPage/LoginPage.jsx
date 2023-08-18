import { useState, useEffect } from "react";
import { loginHandlerF } from "../Reusables/Reusables";

export default function LoginPage() {
  const [loginStatus, setLoginStatus] = useState("error-login hidden");
  const [token] = useState(localStorage.getItem("token-demo-dream"));

  useEffect(() => {
    if (token) location.href = `/chat`;
  }, [token]);
  function login(event) {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;

    postLogin(email, password);
  }
  function postLogin(email, password) {
    loginHandlerF(email,password)
    .then((token) => {
      if (token.error) {
        setLoginStatus("error-login");
        return;
      }
      localStorage.setItem("token-demo-dream", token);
      location.href = `/chat`;
    });
  }

  return (
    <div className="body-login">
      <form onSubmit={login} className="form-login">
        <div className="titolo-login"> Benvenuto 🤙 </div>

        <div className="sottotitolo-login">
          Accedi all&apos;area riservata per chattare
        </div>

        <div className="container-login">
          <div className="container-input-login">
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <div className="container-input-login">
            <label>Password</label>
            <input type="password" name="password" id="" required />
          </div>
          <button type="submit" className="button-login">
            Login
          </button>
          <label className={loginStatus}> Username o passwor errati </label>
        </div>
      </form>
    </div>
  );
}
