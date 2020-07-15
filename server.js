const express = require("express");
const webSocket = require("socket.io");

const app = express();
app.use(express.static(__dirname + "/public"));

const server = app.listen(3030, () =>
  console.log("server listening on port 3030 ...")
);

const socketServer = webSocket(server);

socketServer.on("connection", (socket) => {
  console.log("new user connected ...");

  socket.on("message", (data) => {
    socketServer.emit("message", data);
    console.log(data);
  });
});
