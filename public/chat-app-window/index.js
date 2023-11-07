const baseurl = BASE_URL;
const chatContainer = document.getElementById("chat-container");
let lastMessageId = 0;

document.addEventListener("DOMContentLoaded", () => {
  displayMessagesFromLocalStorage(); // Display messages from local storage
  setInterval(async () => {
    await displayNewMessages();
  }, 1000);
});

async function postMessage() {
  const token = localStorage.getItem("token");
  const message = document.getElementById("message-input").value;

  if (!message.trim()) {
    // If the message is empty or contains only whitespace, don't post it
    return;
  }

  const obj = { message };
  const { data: newMessage } = await axios.post(
    `${baseurl}/chat-box/message`,
    obj,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  document.getElementById("message-input").value = "";

  // Add the new message to local storage
  addMessageToLocalStorage(newMessage);
}

async function getNewMessages() {
  const token = localStorage.getItem("token");
  const { data: newMessagesArray } = await axios.get(
    `${baseurl}/chat-box/get-new-messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        lastMessageId: lastMessageId,
      },
    }
  );
  return newMessagesArray;
}

async function getMessages() {
  const token = localStorage.getItem("token");
  const { data: messagesArray } = await axios.get(
    `${baseurl}/chat-box/get-messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return messagesArray;
}

function addMessageToLocalStorage(newMessage) {
  const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  storedMessages.push(newMessage);

  if (storedMessages.length > 10) {
    // Keep only the latest 10 messages
    storedMessages.splice(0, storedMessages.length - 10);
  }

  localStorage.setItem("chatMessages", JSON.stringify(storedMessages));
}

function displayMessagesFromLocalStorage() {
  const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];

  if (storedMessages.length > 0) {
    storedMessages.forEach((message) => {
      displaySingleMessage(message);
      lastMessageId = message.id;
    });
  }
}

async function displayNewMessages() {
  const newMessagesArray = await getNewMessages();
  newMessagesArray.forEach((element) => {
    displaySingleMessage(element);
    lastMessageId = element.id;
    addMessageToLocalStorage(element); // Add new messages to local storage
  });
}

function displaySingleMessage(element) {
  const chatElement = document.createElement("div");
  chatElement.className = "chat-element";
  const htmlContent = `<b>${element.name}</b> : ${element.message}`;
  chatElement.innerHTML = htmlContent;
  chatContainer.appendChild(chatElement);
}
