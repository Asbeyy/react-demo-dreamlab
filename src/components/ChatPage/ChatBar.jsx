import noPic from '../../assets/no-pfp.png'

import { useState,useEffect } from 'react'

import ResearchBar from './ResearchBar.jsx'

function ChatBar(props){


    return (
    <div className="container-chat-attive">
        <div className="topbar-chatbar">

            <div className='container-profilo-chatbar'>
                <img src={props.foto ||noPic} className="foto-dm-chatbar" />
                <div className="container-nome">
                    <h4>{props.username}</h4>
                    <div className="connection-status"></div>
                </div>
            </div>

            <ResearchBar
                iam={props.iam}
            />

        </div>
       <div className='container-chat-chatbar'>
            {props.chats.map( (chat,index) => {
                return  (
                <ChatPreview
                    key={chat.id_chat + index}
                    mittente={chat.mittente}
                    foto={chat.foto_mittente}
                    ultimo_messaggio={ chat.ultimo_messaggio.message}
                    ora_messaggio={chat.ultimo_messaggio.date}
                    id={chat.id_chat}
                    selectChat={props.selectChat}
                    selectedChat={props.selectedChat === chat.id_chat ? 'selected-message-box': ''}
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

        // Notifica Live chat del click di una nuova chat
        const event = new CustomEvent('chatPreviewClicked');
        window.dispatchEvent(event);

    }

        
    function lastMessage(text){

        if(!text){
            return "Nessun messaggio.."
        } else if (text.length > 54){
            return text.slice(0,54) + "..."
        } else {
            return text;
        }
        

    }

    function formatLastMessageTime(time) {
        if (!time) {
          return '';
        }
      
        const now = new Date();
        const messageDate = new Date(time);

        const hours = String(messageDate.getHours()).padStart(2, '0');
        const minutes = String(messageDate.getMinutes()).padStart(2, '0');
      
        const isSameDay = (date1, date2) =>
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate();
      
        if (isSameDay(now, messageDate)) {
          return `${hours}:${minutes}`;
        } else if (
          now.getDate() - messageDate.getDate() === 1 &&
          isSameDay(now, messageDate)
        ) {
          return 'Yesterday';
        } else {
          const options = {  month: 'short', day: 'numeric' };
          return messageDate.toLocaleDateString(undefined, options);
        }
      }
    
        
    return (
        <>
    <div onClick={handleChatClick} className={`container-chat-preview ${props.selectedChat}`}>
        <img src={ foto } className="foto-utente-preview" />
        <div className="container-dettagli-preview">
            <div className='holder-ora-nome-preview'>
                <div className="nome-utente-preview"> {props.mittente}  </div>
                <div className='ora-messaggio-preview'> {formatLastMessageTime(props.ora_messaggio)}</div>
            </div>
            <div className="messaggio-preview">{lastMessage(props.ultimo_messaggio)}</div>
        </div>
    </div>
        </>
    )
}




export default ChatBar