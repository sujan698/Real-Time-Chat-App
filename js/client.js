document.addEventListener("DOMContentLoaded", () => {
  const socket = io("https://real-time-chat-app-3mvz.onrender.com")

  const form = document.getElementById("send-container");
  const messageInput = document.getElementById("messageInp");
  const messageContainer = document.querySelector(".container");
  var audio = new Audio("ting.mp3");

  const append = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message", position);
    messageContainer.append(messageElement);
    if (position === "left") audio.play();
    messageContainer.scrollTop = messageContainer.scrollHeight;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return;
    append(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
  });

  let name;
  do {
    name = prompt("Enter your name to join:");
  } while (!name || name.trim() === "");

  socket.emit("new-user-joined", name.trim());

  socket.on("user-joined", (name) => {
    append(`${name} joined the chat`, "right");
  });

  socket.on("receive", (data) => {
    append(`${data.name}: ${data.message}`, "left");
  });

  socket.on("user-left", (name) => {
    append(`${name} left the chat`, "right");
  });
});
