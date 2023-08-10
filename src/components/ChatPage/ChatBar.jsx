import noPic from '../../assets/no-pfp.png'

import { useState,useEffect } from 'react'

function ChatBar(props){


    return (
    <div className="container-chat-attive">
        <div className="topbar-chatbar">
            <img src={props.foto ||noPic} className="foto-dm-chatbar" />
            <div className="container-nome">
                <h4>{props.username}</h4>
                <div className="connection-status"></div>
            </div>
        </div>
       <div className='container-chat-chatbar'>
            {props.chats.map( (chat,index) => {
                return  (
                <ChatPreview
                    key={chat.id_chat + index}
                    mittente={chat.mittente}
                    foto={chat.foto_mittente}
                    ultimo_messaggio={ chat.ultimo_messaggio.message}
                    id={chat.id_chat}
                    selectChat={props.selectChat}
                /> 
                )
            })}
       </div>
    </div>
    )
}

function ChatPreview(props){
    const [foto, setFoto] = useState(noPic)

    useEffect(()=> {
        if (props.foto !== ""){
            setFoto(props.foto)
        }
    },[])

    function handleChatClick(){
        props.selectChat({ id_chat: props.id, name_chat: props.mittente, foto: props.foto });

        // Dispatch a custom event to notify ChatBar about chat selection
        const event = new CustomEvent('chatPreviewClicked');
        window.dispatchEvent(event);
    }

    
    return (
        <>
    <div onClick={handleChatClick} className="container-chat-preview">
        <img src={ foto } className="foto-utente-preview" />
        <div className="container-dettagli-preview">
            <div className="nome-utente-preview"> {props.mittente}  </div>
            <div className="messaggio-preview">{props.ultimo_messaggio}</div>
        </div>
    </div>
        <div className='line'></div>
        </>
    )
}



export default ChatBar