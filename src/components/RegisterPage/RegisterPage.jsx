import { handleCreateAccountF } from "../Reusables/Reusables";




export default function RegisterPage() {
  function register(event) {
    event.preventDefault();

    const name = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;

    postRegister(email, password, name);
  }

  function postRegister(email, password, name) {
    handleCreateAccountF(name, email, password)
      .then((token) => {
        if (token.error) {
          alert(token.error);
          return;
        }
        console.log(token.message);
        location.href = "/login";
      });
  }

  return (
    <div className="body-login">
      <form onSubmit={register} className="form-login">
        <div className="titolo-login"> Registrati 💬 </div>

        <div className="sottotitolo-login">
          {" "}
          Registrati e incomincia a chattare{" "}
        </div>

        <div className="container-login">
          <div className="container-input-login">
            <label>Username</label>
            <input
              className="input-login"
              type="text"
              name="name"
              autoComplete="off"
            />
          </div>
          <div className="container-input-login">
            <label>Email</label>
            <input
              className="input-login"
              type="email"
              name="email"
              autoComplete="off"
            />
          </div>
          <div className="container-input-login">
            <label>Password</label>
            <input
              className="input-login"
              type="password"
              name="password"
              autoComplete="off"
            />
          </div>
          <button type="submit" className="button-login">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
