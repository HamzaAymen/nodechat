import moment from "moment";
const messageContainer = document.querySelector(".chat-messages");
export function displayMsg(msg, username) {
  messageContainer.innerHTML += `<div class="message">
    <p class="meta">${username} <span>${moment().format("h:mm:a")}</span></p>
    <p class="text">
    ${msg}
    </p>
    </div>`;
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
