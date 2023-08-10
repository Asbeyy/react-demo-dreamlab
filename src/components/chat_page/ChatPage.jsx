import { useState, useEffect, useRef } from "react"
import { io } from 'socket.io-client'

import noPic from '../../assets/no-pfp.png'
import '../../style/index.css'


export default function ChatPage(prop){
    const [token, setToken] = useState(localStorage.getItem('token-demo-dream'))

    const [username, setUsername] = useState(undefined)
    const [user__id, setUser__id] = useState(undefined)
    const [chats, setChats] = useState([])

    const [selectedChat, setSelectedChat] = useState({id: undefined, name: undefined, foto: undefined})
    const [downloadedMessages, setDownloadedMessages] = useState([])

    const [socket, setSocket] = useState(null)

  

    useEffect(() => {
        if (!token) location.href = '/login'

        /**
         * Richiesta con Queries
         */
        const url = new URL(window.location.href);
        let tokenQuery = url.searchParams.get('tokenQuery');

        //Se user loggato entra in /chat senza query
        !tokenQuery ? tokenQuery = token : null

        fetch('http://172.22.12.13:3000/auth', {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({tokenQuery})
        })
        .then(response => response.json())
        .then(data => {
            data.error ? kickUser() : console.log("Utente autenticato")
            setUsername(data.currentUser.name)
            setUser__id(data.currentUser._id)
        })

        fetch('http://172.22.12.13:3000/fetch-chats',{
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({token})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.chats)
            setChats(data.chats)
        })

        const socketInstance = io("http://172.22.12.13:3000"); 
        setSocket(socketInstance);

        socketInstance.on("aggiorna-preview", () => {
            fetch('http://172.22.12.13:3000/fetch-chats',{
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({token})
        })
        .then(response => response.json())
        .then(data => {
            setChats(data.chats)
        })
        })

        return () => {
        socketInstance.disconnect(); // Clean up socket on umount
        };

    },[])

    useEffect(() => {
        const socketInstance = io("http://172.22.12.13:3000"); 
        socketInstance.on("receive-message", (data) => {
            console.log(data)
          // Controlla che il messaggio ricevuto sia per la chat corrente
          if (data.chatIdentifier === selectedChat.id) {
              setDownloadedMessages(data.messages);  
            }
        });
    
        return () => {
          socketInstance.off("receive-message");
        };
    }, [selectedChat.id, socket]);
    

    function kickUser(){
        location.href = '/login'
        localStorage.removeItem('token-demo-dream')
    }
    function handleChatSelect(chatInfo){
        setSelectedChat({ id: chatInfo.id_chat, name: chatInfo.name_chat, foto: chatInfo.foto });

        const chat_id = chatInfo.id_chat
        fetch('http://172.22.12.13:3000/fetch-messages',{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({ chat_id })
        })
        .then( response => response.json())
        .then( data => {
            setDownloadedMessages(data)
        })
    };

   

    return ( 
    <div className="body-login">
         <div className="chatapp">
            <ChatBar
                username={username}
                chats={chats}
                selectChat={handleChatSelect}
            />
            <LiveChat
                currentChatUser={selectedChat.name}
                currentChatPhoto={selectedChat.foto}
                currentChatId={selectedChat.id}
                messages={downloadedMessages}
                iam={user__id}
            />
         </div>
    </div>
    )
}

function ChatBar(props){

    return (
        <div className="container-chat-attive">
        <div className="topbar-chat">
            <img src={noPic} className="foto-dm-chat" />
            <div className="container-nome">
                <h4>{props.username}</h4>
                <div className="connection-status"></div>
            </div>
        </div>
       
        {props.chats.map( (chat,index) => {
            return  (
            <ChatPreview
                key={chat.id_chat + index}
                mittente={chat.mittente}
                foto={chat.foto_mittente}
                ultimo_messaggio={chat.ultimo_messaggio.message}
                id={chat.id_chat}
                selectChat={props.selectChat}
            /> 
            )
        })}
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
    <div onClick={handleChatClick} className="container-chat-preview">
        <img src={ foto } className="foto-utente-preview" />
        <div className="container-dettagli-preview">
            <div className="nome-utente-preview"> {props.mittente}  </div>
            <div className="messaggio-preview">{props.ultimo_messaggio}</div>
        </div>
    </div>
    )
}

function LiveChat(props){
 const [messagesArray, setMessagesArray] = useState([])
 const messagesEndRef = useRef(null);
 const [loadedMessagesCount, setLoadedMessagesCount] = useState(10);
 const [socket,setSocket] = useState(io("http://172.22.12.13:3000"))
 const messagesStartRef = useRef(null);



    //Setup event listenet x scrollBottom on ChatPreview click
 useEffect(() => {
    function handleChatPreviewClicked() {
        setTimeout(()=>{
            scrollToBottom();
        },200)
        console.log("CLICK MI CHIEDI")
    }
    window.addEventListener('chatPreviewClicked', handleChatPreviewClicked);

    return () => {
        window.removeEventListener('chatPreviewClicked', handleChatPreviewClicked);
    };
  }, []);

    //Carica messaggi solo 10, infinite scroll "Gestione Array"
  useEffect(() => {
    const visibleMessages = props.messages.slice(-loadedMessagesCount);
    setMessagesArray(visibleMessages);
  }, [props.messages, loadedMessagesCount]);

  //Infinite Scroll
  function handleLoadMoreMessages(event) {
    const {scrollTop} = event.target

    if(scrollTop <= 0){
        setLoadedMessagesCount((prevCount) => prevCount + 10);
        //il delay e per contrastart scrollToBottom, //!Da Refactor..
        if (messagesStartRef.current) {
            messagesStartRef.current.scrollIntoView({ block: "start",
            inline: "start", });
            
        }
    }
  }
  function handleSendMessage(newMessageArray){
    setMessagesArray(newMessageArray);
    scrollToBottom()
  };
  function scrollToBottom(){
    messagesEndRef.current.scrollIntoView({  block: "end"})
  }


    return(
        <div className="container-chat">

            <div className="topbar-chat">
                <img src={props.currentChatPhoto || noPic} className="foto-dm-chat" />
                <h4>{props.currentChatUser}</h4>
            </div>

            <div className="live-chat" onScroll={handleLoadMoreMessages}>
                <div className="message-container">
                    {messagesArray.map((message, index) => (
                        <>
                            <div
                                key={`${message.date}+${message.message}`} 
                                className={`bubble-message ${message.sender_id === props.iam ? 'my-message' : 'external-message'}`}
                                >
                                <Message
                                    message={message.message}  
                                    />
                            </div>
                            {(index === messagesArray.length - loadedMessagesCount  + 9 ) ? <div ref={messagesStartRef}></div> : null}
                        </>
                    ))}
                </div>
                <div className="messagesEndRef" ref={messagesEndRef}>&nbsp;</div>
            </div>

            <SendMessageToolBar
                iam={props.iam}
                chat_id={props.currentChatId}
                onSend={handleSendMessage}
            />

        </div>
    )
}

function Message(props){
    return(
        <div className={props.style}>
            <div className="message">
                {props.message}
            </div>
        </div>
    )
}

function SendMessageToolBar(props) {
    const [socket, setSocket] = useState(null)
    
    async function handleMessageSubmit(event) {
        const socketInstance = io("http://172.22.12.13:3000"); 
        setSocket(socketInstance);

      event.preventDefault();
      const message = event.target[0].value;
  
      // Se il messaggio è vuoto, non eseguire
      if (message === "") return;
  
      const chatIdentifier = props.chat_id;
      const messageObject = {
        sender_id: props.iam,
        message,
        date: new Date().getTime(),
      };
  
      try {
        // Manda messaggio al server
        socketInstance.emit("send-message", {chatIdentifier, messageObject})

        //Pulisci campo messaggio dopo invio
        event.target[0].value = ''
      } catch (error) {
        console.error("Errore nel mandare il messaggio: ", error);
      }
    }

    return (
      <form onSubmit={handleMessageSubmit} className="toolbar-chat">
        <input type="text" name="message" autoComplete="off" />
        <button type="submit">Invia</button>
      </form>
    );
}
  
