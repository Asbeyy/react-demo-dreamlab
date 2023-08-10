import { useState,useEffect,useRef } from "react";
import { io } from 'socket.io-client'
import noPic from '../../assets/no-pfp.png'

function LiveChat(props){
    const [messagesArray, setMessagesArray] = useState([])
    const messagesEndRef = useRef(null);
    const [loadedMessagesCount, setLoadedMessagesCount] = useState(10);
    const [socket,setSocket] = useState(io("https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com"))
    const messagesStartRef = useRef(null);
    const [firstTime,setFirstTime] = useState(true)
   
   
   
       //Setup event listenet x scrollBottom on ChatPreview click
       useEffect(() => {
       function handleChatPreviewClicked() {
   
           setLoadedMessagesCount(10)
           setTimeout(()=>{
               scrollToBottom();
           },200)
       }
       window.addEventListener('chatPreviewClicked', handleChatPreviewClicked);
       window.addEventListener('scrollToBottom', scrollToBottom)
   
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
   
       if(firstTime){
           scrollToBottom()
           setFirstTime(false)
           return
       }
   
       if(scrollTop <= 200){
           setLoadedMessagesCount((prevCount) => prevCount + 10);
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
   
           <>
              { /* Conditional Rendering, se non hai selezionato chat, display solo  */}
               {props.currentChatId === undefined ? null : 
               <div className="container-chat">
                   <div className="topbar-chat">
                       <img src={props.currentChatPhoto || noPic} className="foto-dm-chat" />
                       <h4>{props.currentChatUser}</h4>
                   </div>
   
                   <div className="live-chat" onScroll={handleLoadMoreMessages}>
                       <div className="message-container">
                           {messagesArray.map( message => (
                           
                                   <div
                                       key={`${message.date}+${message.message}`}
                                       className={`bubble-message ${message.sender_id === props.iam ? 'my-message' : 'external-message'}`}
                                       >
                                       <Message
                                           message={message.message}  
                                           />
                                   </div>
                               
                           ))}
                       </div>
                       <div className="messagesEndRef" ref={messagesEndRef}></div>
                   </div>
   
                   <SendMessageToolBar
                       iam={props.iam}
                       chat_id={props.currentChatId}
                       onSend={handleSendMessage}
                   />
               </div>}
           </>
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
           const socketInstance = io("https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com"); 
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
 
   


   export default LiveChat