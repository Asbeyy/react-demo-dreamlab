import { useState, useEffect } from "react"

import noPic from '../../assets/no-pfp.png'
import '../../style/index.css'


export default function ChatPage(prop){
    const [token, setToken] = useState(localStorage.getItem('token-demo-dream'))
    const [username, setUsername] = useState(undefined)

    useEffect(() => {
        if (!token) location.href = '/login'

        /**
         * Richiesta con Queries
         */
        const url = new URL(window.location.href);
        let tokenQuery = url.searchParams.get('tokenQuery');

        //Se user loggato entra in /chat senza query
        !tokenQuery ? tokenQuery = token : null

        fetch('http://localhost:3000/auth', {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({tokenQuery})
        })
        .then(response => response.json())
        .then(data => {
            data.error ? utenteNonAuth() : console.log("Utente autenticato")
            setUsername(data.currentUser.name)
        })


    },[])
    

    function utenteNonAuth(){
        location.href = '/login'
        localStorage.removeItem('token-demo-dream')
    }


    return ( 
    <div className="body-login">
         <div className="chatapp">
            <div className="container-chat-attive">
                <div className="topbar-chat">
                    <img src={noPic} className="foto-dm-chat" />
                    <div className="container-nome">
                        <h4>{username}</h4>
                        <div className="connection-status"></div>
                    </div>
                </div>
            </div>
            <div className="container-chat">
                <div className="topbar-chat">
                    <img src={noPic} className="foto-dm-chat" />
                    <h4>Chatname</h4>
                </div>
                <div className="live-chat"></div>
                <div className="toolbar-chat">
                    <input type="text" />
                    <button>Send</button>
                </div>
            </div>
         </div>
    </div>
    )
}


