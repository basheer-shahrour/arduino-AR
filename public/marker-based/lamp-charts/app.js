const tempSensor = document.getElementById("tempSensor");
let e = 1.225;
tempSensor.setAttribute("height", e);
mySocket.socket.on("message", (data) => {
  console.log(data);
  if (data == "inc") {
    e += 0.2;
    if (e <= 1.95) tempSensor.setAttribute("height", e);
  } else if (data == "dec") {
    e -= 0.2;
    if (e >= 0.5) tempSensor.setAttribute("height", e);
  }
});
