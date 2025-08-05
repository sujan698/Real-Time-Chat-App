const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();


// ✅ Create HTTP server first
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("uChat server is running");
});

// ✅ Set port from environment or fallback
const PORT = process.env.PORT || 8000;

// ✅ Create socket.io instance AFTER server is defined
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users = {};

io.on("connection", (socket) => {
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
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
