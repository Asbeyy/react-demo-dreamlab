
import { useState, useEffect } from "react"
import { io } from 'socket.io-client'



import ChatBar from "./ChatBar.jsx"
import LiveChat from "./LiveChat.jsx"
import Unauth from "../Redirects/Unauth.jsx"
import '../../style/index.css'

export default function ChatPage(prop){
    const [token, setToken] = useState(localStorage.getItem('token-demo-dream'))

    const [userEmail, setUserEmail] = useState(undefined)
    const [username, setUsername] = useState(undefined)
    const [userpic, setUserPic] = useState(undefined)
    const [user__id, setUser__id] = useState(undefined)
    const [chats, setChats] = useState([])

    const [selectedChat, setSelectedChat] = useState({id: undefined, name: undefined, foto: undefined})
    const [downloadedMessages, setDownloadedMessages] = useState([])

    const [socket, setSocket] = useState(null)

  

    useEffect(() => {
        if (!token) {
            location.href = '/login'
            return
        }

        const tokenQuery = token

        fetch('https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com/auth', {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({tokenQuery})
        })
        .then(response => response.json())
        .then(data => {
            data.error ? kickUser() : console.log("Utente autenticato")
            setUserEmail(data.currentUser.email)
            setUsername(data.currentUser.name)
            setUserPic(data.currentUser.foto)
            setUser__id(data.currentUser._id)
        })

        fetch('https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com/fetch-chats',{
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

        const socketInstance = io("https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com"); 
        setSocket(socketInstance);

        socketInstance.on("aggiorna-preview", () => {
            fetch('https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com/fetch-chats',{
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
        const socketInstance = io("https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com"); 
        socketInstance.on("receive-message", (data) => {
            console.log(data)
          // Controlla che il messaggio ricevuto sia per la chat corrente
          if (data.chatIdentifier === selectedChat.id) {
              setDownloadedMessages(data.messages);
               // Dispatch a custom event to notify ChatBar about chat selection
            const event = new CustomEvent('chatPreviewClicked');
            window.dispatchEvent(event);
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
        fetch('https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com/fetch-messages',{
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
        <>
        {!username ? <Unauth/> :  <div className="body-app">
         <div className="chatapp">
            <ChatBar
                username={username}
                foto={userpic}
                chats={chats}
                selectChat={handleChatSelect}
                selectedChat={selectedChat.id}
                iam={userEmail}
            />
            
            <LiveChat
                currentChatUser={selectedChat.name}
                currentChatPhoto={selectedChat.foto}
                currentChatId={selectedChat.id}
                messages={downloadedMessages}
                iam={user__id}
            />
         </div>
    </div>}
        </>
   
    )
}




