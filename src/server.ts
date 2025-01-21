import express, { Request, Response } from "express";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors()); // Enable CORS for cross-origin requests.

app.get('/time', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send data every second
  const interval = setInterval(() => {
    const time = new Date().toISOString();
    res.write(`data: ${time}\n\n`);
  }, 1000);

  // Cleanup when the connection is closed
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

// Start the server
const PORT = 5004;
app.listen(PORT, () => console.log(`SSE server running on http://localhost:${PORT}`));


const io = new Server(5080, {
  cors: {origin: "*"}
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-room", (room) =>{
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);
  });

  socket.on("add-name", (room, name) =>{
    io.to(room).emit("add-name", name)
    console.log(`${socket.id} set name ${name}`);
  });

  socket.on("send-message", ({ room, message}) => {
    io.to(room).emit("recieved-message", message)
  });

  socket.on("disconnect", () => {
    console.log("A user Disconnected:", socket.id);    
  });
  
})