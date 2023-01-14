import "../../utils/axios-config";
import axios from "axios";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
import { displayMsg } from "../../utils/displayMsg";

const groups = document.getElementById("joined-groups");
const sendChatForm = document.getElementById("chat-form");
const msgInput = document.getElementById("msg");
const messageContainer = document.querySelector(".chat-messages");
const availableRooms = document.querySelector(".allrooms");
const joinRoom = document.getElementById("join-room-input");
const joinRoomBtn = document.querySelector(".join-room-btn");
const roomNotFound = document.querySelector(".room-not-found");
const roomFound = document.querySelector(".room-created");
const createRoom = document.getElementById("create-room-input");
const createRoomBtn = document.querySelector(".create-room-btn");
const signOutBtn = document.querySelector(".sign-out");
const baseUrl = "http://localhost:4000";

// Variables that will be fetch from db
let currentRoom;
let username;

// Get all joined rooms and display them
const displayRooms = async () => {
  const rooms = await axios(`${baseUrl}/rooms`);
  for (let name of rooms.data) {
    groups.innerHTML += `<li>${name}</li>`;
  }

  // Join to the first room in the list
  const allRooms = document.querySelectorAll("#joined-groups li");
  allRooms[0].classList.add("active");
  changeRoom(allRooms);
};
displayRooms();

// Join current room
const joinCurrentRoom = async () => {
  const { data } = await axios(`${baseUrl}/username`);
  username = data;

  socket.on("connect", () => {
    // Display welcome message
    displayMsg(`Welcome ${username}`, `Node Chat`);

    // Join the current room
    currentRoom = document.querySelector("#joined-groups .active");
    socket.emit("join-room", currentRoom.innerHTML);
  });
};
joinCurrentRoom();

// Switch to another room on click
const changeRoom = (allRooms) => {
  for (let room of allRooms) {
    room.addEventListener("click", () => {
      for (let rooms of allRooms) {
        rooms.classList.remove("active");
      }
      room.classList.add("active");
      messageContainer.innerHTML = "";
      socket.emit("join-room", room.innerHTML);
    });
  }
};

// Sending message to active group
const sendMsg = () => {
  sendChatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!msgInput.value) return;
    displayMsg(msgInput.value, username);
    currentRoom = document.querySelector("#joined-groups .active");
    socket.emit("send-msg", msgInput.value, username, currentRoom.innerHTML);
    msgInput.value = "";
  });
};
sendMsg();

// When we receive a message display it
socket.on("receive-msg", (msg, sender) => {
  displayMsg(msg, sender);
});

// Get all available rooms
const getAllRooms = async () => {
  const allRooms = await axios(`${baseUrl}/allrooms`);
  const allJoinedRooms = await axios(`${baseUrl}/rooms`);
  for (let room of allRooms.data) {
    if (!allJoinedRooms.data.includes(room)) {
      availableRooms.innerHTML += `<li> ${room}</li>`;
    }
  }
};
getAllRooms();

// Join room on chat page
joinRoomBtn.addEventListener("click", async () => {
  try {
    if (!joinRoom.value) return;
    res = await axios.post(`${baseUrl}/joinroom`, { name: joinRoom.value });
    joinRoom.value = "";
    displayRooms();
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        joinRoom.value = "";
        return (roomNotFound.style.display = "block");
      }
    }
  }
});

// Create room on chat page
createRoomBtn.addEventListener("click", async () => {
  try {
    if (!createRoom.value) return;
    await axios.post(`${baseUrl}/newroom`, { name: createRoom.value });
    await axios.post(`${baseUrl}/joinroom`, { name: createRoom.value });
    createRoom.value = "";
    location.reload();
  } catch (error) {
    if (error.response) {
      if (error.response.status === 409) {
        createRoom.value = "";
        return (roomFound.style.display = "block");
      }
    }
  }
});

// Signout
signOutBtn.addEventListener("click", () => {
  axios(`${baseUrl}/signout`);
});
