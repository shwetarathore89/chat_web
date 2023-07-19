const express = require("express");
const cors = require("cors");
const port = 5000;

const app = express();

app.use(cors());
app.use(express.json());


app.get("/",(req,res) => {
    res.send("This is a dummy api");
});

const server = app.listen(port, console.log(`Server started on POST ${port}`));
const io = require('socket.io')(server, {
    pingTimeout : 60000,
    cors: {
        origin: 'http://localhost:3000',
    },
});

io.on("connection", (socket) => {
    
    console.log("A user connected.");
    // Listen for "sendMessage" events from clients
    socket.on("sendMessage", (data) => {
      // Broadcast the message to all connected clients, including the sender
      io.emit("message", data);
      console.log("Emitting message" + data.author)
      console.log("Emitting message" + data.message)
    });
  
    // Clean up when the client disconnects
    socket.on("disconnect", () => {
      console.log("A user disconnected.");
    });
  });
