import { Server } from "socket.io";

let connections = {};  // roomId -> [{ id, name }]
let timeOnline = {};   // socketId -> Date()

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // ✅ join call with username
   socket.on("join-call", ({ roomId, name }) => {
  if (!roomId) return;

  socket.join(roomId); // ✅ IMPORTANT

  if (!connections[roomId]) connections[roomId] = [];

  const already = connections[roomId].some((p) => p.id === socket.id);
  if (!already) {
    connections[roomId].push({ id: socket.id, name: name || "Guest" });
  }

  timeOnline[socket.id] = new Date();

  // ✅ emit only to THIS ROOM
  io.to(roomId).emit("user-joined", socket.id, connections[roomId]);

  console.log(`📌 ${socket.id} joined room ${roomId}`);
});


    // (offer/answer/ice all come here)
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      for (const roomId in connections) {
        const index = connections[roomId].findIndex((p) => p.id === socket.id);

        if (index !== -1) {
          // notify room members that user left
           io.to(roomId).emit("user-left", socket.id);


          
          connections[roomId].splice(index, 1);

          if (connections[roomId].length === 0) delete connections[roomId];
          break;
        }
      }

      delete timeOnline[socket.id];
    });
  });

  return io;
};
