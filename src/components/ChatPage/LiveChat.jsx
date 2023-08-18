import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import noPic from "../../assets/no-pfp.png";

function LiveChat(props) {
  const [messagesArray, setMessagesArray] = useState([]);
  const messagesEndRef = useRef(null);
  const [loadedMessagesCount, setLoadedMessagesCount] = useState(10);
  const [firstTime, setFirstTime] = useState(true);

  //Setup event listenet x scrollBottom on ChatPreview click
  useEffect(() => {
    function handleChatPreviewClicked() {
      //Al cambio chat, reset il counter messaggi iniziali a 10
      setLoadedMessagesCount(10);

      //! 400ms delay, da refactor
      setTimeout(() => {
        scrollToBottom();
      }, 400);
    }
    window.addEventListener("chatPreviewClicked", handleChatPreviewClicked);
    window.addEventListener("scrollToBottom", ()=>{
      setTimeout(()=>{
        scrollToBottom()
      },20)
    });

    return () => {
      window.removeEventListener(
        "chatPreviewClicked",
        handleChatPreviewClicked
      );
    };
    
    //! Avrei potuto usare dependencies x handleChatPrvCl al cambio di props.messages invece di EventListener.
  }, []);
  //Carica messaggi solo 10, infinite scroll "Gestione Array"
  useEffect(() => {
    const visibleMessages = props.messages.slice(-loadedMessagesCount);
    setMessagesArray(visibleMessages);
  }, [props.messages, loadedMessagesCount]);

  function handleLoadMoreMessages(event) {
    const { scrollTop } = event.target;


    //Se e la prima entrata 
    if (firstTime) {
      scrollToBottom();
      setFirstTime(false);
      return;
    }

    //Infinite Scroll effect, buffer zone 200px
    if (scrollTop <= 200) {
      setLoadedMessagesCount((prevCount) => prevCount + 10);
    }
  }
  function handleCallClick() {
    alert("Bottoni non attivi");
  }

  //Gestisci scroll a fondo pagina
  function scrollToBottom() {
    messagesEndRef.current.scrollIntoView({ block: "end" });
  }

  return (
    <>
      {/* Conditional Rendering, se non hai selezionato chat, display solo  */}
      {props.currentChatId === undefined ? null : (
        <div className="container-chat">
          <div className="topbar-chat">
            <div className="holder-info-chat">
              <img
                // Nome & Foto utente chat
                src={props.currentChatPhoto || noPic}
                className="foto-dm-chat"
              />
              <h4>{props.currentChatUser}</h4>
            </div>

            <div className="container-telefono-chat">
              <svg
                onClick={handleCallClick}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="logo-telefono"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              <svg
                onClick={handleCallClick}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="logo-telefono"
              >
                <path
                  strokeLinecap="round"
                  d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
          </div>

          <div className="live-chat" onScroll={handleLoadMoreMessages}>
            <div className="message-container">
              {messagesArray.map((message) => (
                <div
                  key={`${message.date}+${message.message}`}
                  className={`bubble-message ${
                    message.sender_id === props.iam
                      ? "my-message"
                      : "external-message"
                  }`}
                >
                  <Message
                    message={message.message}
                    ora_ricevuto={message.date}
                    style={
                      message.sender_id === props.iam
                        ? "my-hour"
                        : "external-hour"
                    }
                  />
                </div>
              ))}
            </div>
            <div className="messagesEndRef" ref={messagesEndRef}></div>
          </div>

          <SendMessageToolBar
            iam={props.iam}
            chat_id={props.currentChatId}
            onSend={scrollToBottom}
          />
        </div>
      )}
    </>
  );
}

function Message(props) {
  function formatUnixToHour(time) {
    if (!time) return "";

    const date = new Date(time);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  return (
    <div className="container-elemento-messaggio">
      <div className="message">{props.message}</div>
      <div className={`ora-chat-message ${props.style}`}>
        {formatUnixToHour(props.ora_ricevuto)}
      </div>
    </div>
  );
}

function SendMessageToolBar(props) {
  const [socket, setSocket] = useState(null);

  async function handleMessageSubmit(event) {
    const socketInstance = io("https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com");
    setSocket(socketInstance);

    //Prevent ricarica pagina con submit form messaggio
    event.preventDefault();

    //Target value del field messaggio
    const message = event.target[0].value;

    // Se il messaggio è vuoto, non eseguire
    if (message === "") return;

    //Compone elementi da mandare al DB per salvare il messaggio (ID_CHAT & {ID_MITTENTE.MESSAGGIO.DATA})
    const chatIdentifier = props.chat_id;
    const messageObject = {
      sender_id: props.iam,
      message,
      date: new Date().getTime(),
    };

    try {
      // Manda messaggio al server
      socketInstance.emit("send-message", { chatIdentifier, messageObject });
      //Pulisci campo messaggio dopo invio
      event.target[0].value = "";
    } catch (error) {
      console.error("Errore nel mandare il messaggio: ", error);
    }
  }

  return (
    <form onSubmit={handleMessageSubmit} className="toolbar-chat">
      <input
        placeholder="Messaggio.."
        type="text"
        name="message"
        autoComplete="off"
      />
      <button type="submit">Invia</button>
    </form>
  );
}

export default LiveChat;
