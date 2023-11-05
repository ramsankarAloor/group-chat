const baseurl = BASE_URL;
const chatContainer = document.getElementById("chat-container");

document.addEventListener("DOMContentLoaded", () => {
  displayMessages();
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
  console.log(newMessage);
  document.getElementById("message-input").value = "";
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
  });
}

function displaySingleMessage(element) {
  const chatElement = document.createElement("div");
  chatElement.className = "chat-element";
  const htmlContent = `<b>${element.name}</b> : ${element.message}`;
  chatElement.innerHTML = htmlContent;
  chatContainer.appendChild(chatElement);
}
