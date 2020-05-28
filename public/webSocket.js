let socket = io.connect("http://localhost:3030");
socket.on("connect", data => {
  console.log("connection sucssed ...");
});

socket.on("message", data => {
  console.log(data);
});
