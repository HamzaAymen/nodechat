const form = document.querySelector(".form");
const createRoom = document.getElementById("create-room");
const joinRoom = document.getElementById("join-room");
const roomExists = document.querySelector(".room-exist");
const roomNotFound = document.querySelector(".room-not-found");
const availableRooms = document.querySelector(".allrooms");
const baseUrl = "http://localhost:4000";

import axios from "axios";
import "../../utils/axios-config";

// Get all available rooms
const getAllRooms = async () => {
  const allRooms = await axios(`${baseUrl}/allrooms`);
  for (let room of allRooms.data) {
    availableRooms.innerHTML += `<li> - ${room}</li>`;
  }
};
getAllRooms();

// On submit send the data to server and create new user
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // if you dont pass any values or you passed to value we will prevent it
  if (!createRoom.value && !joinRoom.value) return;
  if (createRoom.value && joinRoom.value) return;

  // if you want to create room
  let res;
  try {
    roomExists.style.display = "none";
    roomNotFound.style.display = "none";
    if (createRoom.value) {
      res = await axios.post(`${baseUrl}/newroom`, {
        name: createRoom.value,
      });
    }
    // if you want to join a room
    else {
      res = await axios.post(`${baseUrl}/joinroom`, { name: joinRoom.value });
    }
  } catch (error) {
    // if the room you want to create is already exist send message
    if (error.response) {
      if (error.response.status === 404)
        return (roomNotFound.style.display = "block");
      if (error.response.status === 409)
        return (roomExists.style.display = "block");
    }
  }

  return (location.href = `http://localhost:3000/frontend/html/chat.html`);
});
