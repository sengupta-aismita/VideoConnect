import { Server } from "socket.io";

let connections = {};  // roomId -> [socketIds]
let timeOnline = {};   // socketId -> Date()

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // dev
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-call", (roomId) => {
      if (!connections[roomId]) connections[roomId] = [];

      connections[roomId].push(socket.id);
      timeOnline[socket.id] = new Date();

      // notify everyone in room about new user
      connections[roomId].forEach((id) => {
        io.to(id).emit("user-joined", socket.id, connections[roomId]);
      });

      console.log(`📌 ${socket.id} joined room ${roomId}`);
    });

    //  (offer/answer/ice all come here)
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      for (const roomId in connections) {
        const index = connections[roomId].indexOf(socket.id);

        if (index !== -1) {
          // notify room members that user left
          connections[roomId].forEach((id) => {
            io.to(id).emit("user-left", socket.id);
          });

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
