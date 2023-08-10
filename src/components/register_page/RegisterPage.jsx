import Header from '../header/Header.jsx'


export default function RegisterPage(){

    function register(event){
        event.preventDefault()
        
        const name = event.target[0].value
        const email = event.target[1].value
        const password = event.target[2].value
        
        postRegister(email,password,name)
    }

    function postRegister(email,password,name){
        fetch("https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com/create-user",{
            method: "POST",
            headers:{
                "Content-type":"application/json"
            },
            body: JSON.stringify({name,email,password})
        })
        .then(response => response.json())
        .then(token => {
            if (token.error) {
                alert(token.error)
                return
            }
            console.log(token.message)
            location.href = '/login'
        })
    }



    return ( 
    <div className="body-login">
        <Header/>
        <form onSubmit={register} className="form-login">
            <div className="titolo-login"> Registrati 💬 </div>

            <div className="sottotitolo-login"> Registrati e incomincia a chattare </div>

            <div className="container-login">
            <div className="container-input-login">
                    <label>Username</label>
                    <input className="input-login" type="text" name="name"/>
                </div>
                <div className="container-input-login">
                    <label>Email</label>
                    <input className="input-login" type="text" name="email"/>
                </div>
                <div className="container-input-login">
                    <label>Password</label>
                    <input className="input-login" type="password" name="password"/>
                </div>
                <button type='submit' className="button-login">
                    Login
                </button>
            </div>
        </form>
    </div> 
    )
}