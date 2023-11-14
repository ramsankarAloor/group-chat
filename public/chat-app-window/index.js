// Define a doubly linked list and its nodes
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  enqueue(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  dequeue() {
    if (!this.head) {
      return null;
    }

    const value = this.head.value;
    this.head = this.head.next;
    if (this.head) {
      this.head.prev = null;
    }

    return value;
  }
}

// Function to serialize a doubly linked list to JSON
function serializeDoublyLinkedList(linkedList) {
  const serializedData = [];
  let current = linkedList.head;
  while (current) {
    serializedData.push(current.value);
    current = current.next;
  }
  return JSON.stringify(serializedData);
}

// Function to deserialize JSON to a doubly linked list
function deserializeDoublyLinkedList(serializedData) {
  const data = JSON.parse(serializedData);

  if (!Array.isArray(data)) {
    return new DoublyLinkedList(); // Return an empty list if the data is not an array
  }

  const linkedList = new DoublyLinkedList();
  for (const item of data) {
    linkedList.enqueue(item);
  }
  return linkedList;
}

// Constants and elements
const baseurl = BASE_URL;
const chatContainer = document.getElementById("chat-container");
let lastMessageId = 0;

// Initialize a doubly linked list for storing messages
const messageQueue = new DoublyLinkedList();

// Add a message to local storage using the doubly linked list
function addMessageToLocalStorage(newMessage) {
  const serializedMessages = localStorage.getItem("chatMessages");
  const messageQueue =
    deserializeDoublyLinkedList(serializedMessages) || new DoublyLinkedList();
  messageQueue.enqueue(newMessage);

  while (messageQueue.head) {
    if (messageQueue.head.value.id <= newMessage.id - 10) {
      messageQueue.dequeue();
    } else {
      break;
    }
  }

  localStorage.setItem("chatMessages", serializeDoublyLinkedList(messageQueue));
}

// Function to display a single chat message
function displaySingleMessage(element) {
  const chatElement = document.createElement("div");
  chatElement.className = "chat-element";
  const htmlContent = `<b>${element.name}</b> : ${element.message}`;
  chatElement.innerHTML = htmlContent;
  chatContainer.appendChild(chatElement);
}

// Function to retrieve new messages from the server and display them
async function displayNewMessages() {
  const newMessagesArray = await getNewMessages();
  newMessagesArray.forEach((element) => {
    messageQueue.enqueue(element); // Add messages to the queue
    displaySingleMessage(element);
    lastMessageId = element.id;
    addMessageToLocalStorage(element); // Add new messages to local storage
  });
}

// Function to get new messages from the server
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

// Function to display messages from local storage
function displayMessagesFromLocalStorage() {
  const serializedMessages = localStorage.getItem("chatMessages");
  const messageQueue = deserializeDoublyLinkedList(serializedMessages);

  if (messageQueue && messageQueue.head) {
    let current = messageQueue.head;
    while (current) {
      displaySingleMessage(current.value);
      lastMessageId = current.value.id;
      current = current.next;
    }
  }
}

// Event handler for posting a message
async function postMessage() {
  const token = localStorage.getItem("token");
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value.trim();

  if (message === "") {
    return; // Don't post empty messages
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

  messageInput.value = "";

  // Add the new message to the queue and local storage
  messageQueue.enqueue(newMessage);
  addMessageToLocalStorage(newMessage);
  displaySingleMessage(newMessage);
  lastMessageId = newMessage.id;
}

// Add a DOMContentLoaded event listener to initialize the page
document.addEventListener("DOMContentLoaded", () => {
  listGroups();
  displayMessagesFromLocalStorage(); // Display messages from local storage
  // setInterval(displayNewMessages, 1000); // Periodically check for new messages
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
  hidePopup();
}

function showPopup() {
  document.getElementById("overlay").style.display = "block";
}

function hidePopup() {
  // Hide the overlay
  document.getElementById("overlay").style.display = "none";
}

function addToGroups(groupname) {
  const joinedList = document.getElementById("joined-list");
  const groupDiv = document.createElement("div");
  groupDiv.classList = "heading group-div";
  const htmlContent = `<h4>${groupname}</h4>`;
  groupDiv.innerHTML = htmlContent;
  joinedList.appendChild(groupDiv);

  groupDiv.addEventListener("click", () => selectGroup(groupname));
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
    addToGroups(element.group.groupName);
  });
}

async function selectGroup(groupname) {
  const token = localStorage.getItem("token");
  
  const groupNameChatHeading = document.getElementById(
    "group-name-chat-heading"
  );
  const htmlGroupHeading = `<h2>${groupname}</h2>`;
  groupNameChatHeading.innerHTML = htmlGroupHeading;
}
