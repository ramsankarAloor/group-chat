const baseurl = BASE_URL;
const chatContainer = document.getElementById("chat-container");
let lastMessageId = 0;

document.addEventListener("DOMContentLoaded", async () => {
  await displayMessages();
  setInterval(async () => {
    await displayNewMessages();
  }, 1000);
});

async function postMessage() {
  const token = localStorage.getItem("token");
  const message = document.getElementById("message-input").value;

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

async function displayMessages() {
  const userMessageArray = await getMessages();
  userMessageArray.forEach((element) => {
    displaySingleMessage(element);
    lastMessageId = element.id;
  });
}

async function displayNewMessages() {
  const newMessagesArray = await getNewMessages();
  newMessagesArray.forEach((element) => {
    displaySingleMessage(element);
    lastMessageId = element.id;
  });
}

function displaySingleMessage(element) {
  const chatElement = document.createElement("div");
  chatElement.className = "chat-element";
  const htmlContent = `<b>${element.name}</b> : ${element.message}`;
  chatElement.innerHTML = htmlContent;
  chatContainer.appendChild(chatElement);
}
