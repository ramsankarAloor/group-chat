const baseurl = BASE_URL;
const chatContainer = document.getElementById("chat-container");
let lastMessageId = 0;

document.addEventListener("DOMContentLoaded", () => {
  listGroups();
});

function displaySingleMessage(element) {
  const chatElement = document.createElement("div");
  chatElement.className = "chat-element";
  const htmlContent = `<b>${element.name}</b> : ${element.message}`;
  chatElement.innerHTML = htmlContent;
  chatContainer.appendChild(chatElement);
}

async function getMessages() {
  const token = localStorage.getItem("token");
  const groupId = localStorage.getItem("groupId");

  const { data: messages } = await axios.get(
    `${baseurl}/chat-box/get-messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        groupId,
      },
    }
  );
  console.log(messages);

  messages.forEach((element) => {
    displaySingleMessage(element);
    lastMessageId = element.id;
  });
}

async function getNewMessages() {
  const token = localStorage.getItem("token");
  const groupId = localStorage.getItem("groupId");

  const { data: newMessages } = await axios.get(
    `${baseurl}/chat-box/get-new-messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        lastMessageId,
        groupId
      },
    }
  );

  console.log(newMessages);

  newMessages.forEach((element)=>{
    displaySingleMessage(element);
    lastMessageId = element.id;
  })
}

async function postMessage() {
  const token = localStorage.getItem("token");
  const groupId = localStorage.getItem("groupId");
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value.trim();

  if (message === "") {
    return; // Don't post empty messages
  }

  const obj = { message, groupId };
  const { data: newMessage } = await axios.post(
    `${baseurl}/chat-box/message`,
    obj,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  messageInput.value = "";
}

async function createNewGroup() {
  const token = localStorage.getItem("token");
  const groupNameInput = document.getElementById("group-name");
  const groupName = groupNameInput.value.trim();
  if (groupName === "") {
    return;
  }
  const obj = { groupName };
  const { data: newGroup } = await axios.post(
    `${baseurl}/groups/create-new-group`,
    obj,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  addToGroups(newGroup.groupName);
  groupNameInput.value = "";
  hideNewGroupPopup();
}

function showNewGroupPopup() {
  document.getElementById("new-group-overlay").style.display = "block";
}

function hideNewGroupPopup() {
  // Hide the overlay
  document.getElementById("new-group-overlay").style.display = "none";
}

function addToGroups(groupname, groupId) {
  const joinedList = document.getElementById("joined-list");
  const groupDiv = document.createElement("div");
  groupDiv.classList = "heading group-div";
  const htmlContent = `<h4>${groupname}</h4>`;
  groupDiv.innerHTML = htmlContent;
  joinedList.appendChild(groupDiv);

  groupDiv.addEventListener("click", () => selectGroup(groupname, groupId));
}

async function listGroups() {
  const token = localStorage.getItem("token");
  const { data: groupsList } = await axios.get(
    `${baseurl}/groups/list-groups`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // console.log("groups => ", groupsList);
  groupsList.forEach((element) => {
    addToGroups(element.group.groupName, element.group.id);
  });
}

async function selectGroup(groupname, groupId) {
  localStorage.setItem("groupId", groupId);
  const token = localStorage.getItem("token");

  const groupNameChatHeading = document.getElementById(
    "group-name-chat-heading"
  );
  const htmlGroupHeading = `<h2>${groupname}</h2>`;
  groupNameChatHeading.innerHTML = htmlGroupHeading;
  document.getElementById("chat-container").innerHTML = "";

  getMessages();
  setInterval(()=>getNewMessages(), 1000);
}
