import { createServer } from "http";
import { Server } from "socket.io";

// Intilize socket.io server
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});
io.listen(process.env.SOCKET_PORT);

io.on("connection", (socket) => {
  // Re-send message to the client
  socket.on("send-msg", (msg, user, room) => {
    socket.to(room).emit("receive-msg", msg, user);
  });

  // Join room
  socket.on("join-room", (roomName) => {
    let listOfRooms = socket.rooms;
    for (let room of listOfRooms) {
      if (room !== socket.id) {
        socket.leave(room);
        listOfRooms.delete(room);
      }
    }
    socket.join(roomName);
  });
});
