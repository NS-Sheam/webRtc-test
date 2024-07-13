import express, { Application } from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import path from "path";
import cors from "cors";
const DEFAULT_PORT = 5000;
let activeSockets: string[] = [];

const initializeServer = (): {
  app: Application;
  httpServer: HTTPServer;
  io: SocketIOServer;
} => {
  const app = express();
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer);
  app.use(cors());

  configureApp(app);
  handleSocketConnection(io);

  return { app, httpServer, io };
};

const configureApp = (app: Application): void => {
  app.use(express.static(path.join(__dirname, "../public")));
};

const handleRoutes = (app: Application): void => {
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
};

const handleSocketConnection = (io: SocketIOServer): void => {
  io.on("connection", (socket) => {
    if (!activeSockets.includes(socket.id)) {
      activeSockets.push(socket.id);

      socket.emit("update-user-list", {
        users: activeSockets.filter(id => id !== socket.id),
      });

      socket.broadcast.emit("update-user-list", {
        users: [socket.id],
      });
    }

    socket.on("disconnect", () => {
      activeSockets = activeSockets.filter(id => id !== socket.id);
      socket.broadcast.emit("update-user-list", {
        users: activeSockets,
      });
    });

    // Handle signaling for video call
    socket.on("offer", (data) => {
      socket.broadcast.emit("offer", { offer: data.offer, id: socket.id });
    });

    socket.on("answer", (data) => {
      socket.broadcast.emit("answer", { answer: data.answer, id: socket.id });
    });

    socket.on("ice-candidate", (data) => {
      socket.broadcast.emit("ice-candidate", { candidate: data.candidate, id: socket.id });
    });
  });
};

const listen = (httpServer: HTTPServer, callback: (port: number) => void): void => {
  httpServer.listen(DEFAULT_PORT, () => callback(DEFAULT_PORT));
};

const startServer = (): void => {
  const { app, httpServer, io } = initializeServer();
  handleRoutes(app);
  listen(httpServer, (port: number) => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
