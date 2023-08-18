export async function authenticateUserF(tokenQuery) {
  return fetch("https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokenQuery }),
  }).then((response) => response.json());
}

export async function ActiveChatsF(token) {
  return fetch(
    "https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com/fetch-chats",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    }
  ).then((response) => response.json());
}

export async function DownloadChatMessagesF(chat_id) {
  return fetch(
    "https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com/fetch-messages",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat_id }),
    }
  ).then((response) => response.json());
}

export async function loginHandlerF(email, password) {
  return fetch("https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((response) => response.json());
}

export async function handleCreateAccountF(name, email, password) {
  return fetch(
    "https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com/create-user",
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    }
  ).then((response) => response.json());
}
