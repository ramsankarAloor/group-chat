const baseurl = BASE_URL;
const chatContainer = document.getElementById("chat-container");
let lastMessageId = 0;

const socket = io(baseurl);

document.addEventListener("DOMContentLoaded", () => {
  listGroups();
  listInvites();
});

socket.on("connect", () => {
  console.log("socket id >>> ", socket.id);
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
  // console.log(messages);

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
        groupId,
      },
    }
  );

  // console.log(newMessages);

  newMessages.forEach((element) => {
    displaySingleMessage(element);
    lastMessageId = element.id;
  });
}

async function postMessage1() {
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
  displaySingleMessage(newMessage);
  socket.emit("send-message", newMessage); // groupId is the room
}

socket.on("receive-message", (message) => {
  console.log("received message >>", message);
  displaySingleMessage(message);
});

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
  socket.emit("join-group", groupId); // joining the room

  const groupNameChatHeading = document.getElementById(
    "group-name-chat-heading"
  );
  const htmlGroupHeading = `<h2>${groupname}</h2>`;
  groupNameChatHeading.innerHTML = htmlGroupHeading;
  document.getElementById("chat-container").innerHTML = "";

  getMessages();
  // setInterval(() => getNewMessages(), 1000);
}

// invite

function showInvitePopup() {
  document.getElementById("invite-overlay").style.display = "block";
}
function hideInvitePopup() {
  document.getElementById("invite-overlay").style.display = "none";
}

async function sendInvite() {
  const token = localStorage.getItem("token");
  const groupId = localStorage.getItem("groupId");
  const inviteeEmail = document.getElementById("invitee").value;
  if (!inviteeEmail) {
    return;
  }
  const obj = { inviteeEmail, groupId };
  const { data: invite } = await axios.post(
    `${baseurl}/groups/send-invite`,
    obj,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("Invite >>> ", invite);
  hideInvitePopup();
  socket.emit("send-invite", invite);
  alert(`Group invite sent to ${inviteeEmail}`);
}

socket.on("receive-invite", (invite) => {
  console.log("received invite >>", invite);
  addToInvites(invite);
});

function addToInvites(invite) {
  const invitesList = document.getElementById("invites-list");
  const inviteDiv = document.createElement("div");
  inviteDiv.className = "invite-div";
  const textDiv = document.createElement("div");
  textDiv.className = "text-div";
  textDiv.innerHTML = `${invite.fromUser.name} invited you to join the group <b>${invite.group.groupName}</b>`;

  const joinBtnDiv = document.createElement("div");
  const joinButton = document.createElement("button");
  joinBtnDiv.className = "join-button-div";
  joinButton.textContent = "Join";
  joinBtnDiv.appendChild(joinButton);

  inviteDiv.appendChild(textDiv);
  inviteDiv.appendChild(joinBtnDiv);
  invitesList.appendChild(inviteDiv);

  joinButton.addEventListener("click", joinGroup);

  async function joinGroup() {
    const token = localStorage.getItem("token");
    const groupId = invite.group.id;

    const obj = { groupId, inviteId: invite.id };

    const { data: success } = await axios.post(
      `${baseurl}/groups/join-group`,
      obj,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(success);
    alert(`You have joined group `);
  }
}

async function listInvites() {
  const token = localStorage.getItem("token");
  const { data: invitesList } = await axios.get(
    `${baseurl}/groups/list-invites`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // console.log(invitesList);
  invitesList.forEach((invite) => addToInvites(invite));
}

function showGroupInfo() {
  window.location.href = "../group-info/index.html";
}
