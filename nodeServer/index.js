const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// ✅ Create a raw HTTP server
const server = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") {
    res.writeHead(204); // No Content
    res.end();
  }
});

// ✅ Pass HTTP server to Socket.IO
const io = new Server(server, {
  cors: {
    origin: "https://real-time-chat-app-two-ruby.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users = {};

// ✅ Handle socket events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-left", users[socket.id]);
    delete users[socket.id];
  });
});

// ✅ Start the server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
