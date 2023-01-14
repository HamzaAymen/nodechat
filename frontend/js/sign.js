import axios from "axios";
import "../../utils/axios-config";
const form = document.querySelector(".form");
const username = document.getElementById("username");
const password = document.getElementById("password");
const wrongPas = document.querySelector(".display-error");
const baseUrl = "http://localhost:4000";

// On submit send the data to server and create new user
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (username.value && password.value) {
    try {
      let res = await axios.post(`${baseUrl}`, {
        username: username.value,
        password: password.value,
      });

      // if you allready signed in go directly to chat
      if (res.status === 200)
        return (location.href = `http://localhost:3000/frontend/html/chat.html`);

      return (location.href = `http://localhost:3000/frontend/html/room.html`);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403)
          return (wrongPas.style.display = "block");
      }
    }
  }
});
