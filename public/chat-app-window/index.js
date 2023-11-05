const baseurl = BASE_URL;

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
  window.location.reload();
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
  console.log("userMessageArray >>>> ", userMessageArray);
  const chatContainer = document.getElementById("chat-container");

  userMessageArray.forEach((element) => {
    const chatElement = document.createElement("div");
    chatElement.className = 'chat-element'
    const htmlContent = `<b>${element.name}</b> : ${element.message}`;
    chatElement.innerHTML = htmlContent;
    chatContainer.appendChild(chatElement);
  });
}
