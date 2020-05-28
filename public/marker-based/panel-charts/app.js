// let socket = io.connect("http://localhost:3030/");
// socket.on("connect", data => {
//   console.log("connection sucssed ...");
// });

// socket.on("message", data => {
//   console.log(data);
// });

AFRAME.registerComponent("markerhandler", {
  init: () => {
    this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);

    const text1 = document.getElementById("text1");
    const text2 = document.getElementById("text2");

    text1.addEventListener("click", ev => {
      console.log("Text1 ...");
      console.log(ev.detail.intersection.uv.x);
      console.log(ev.detail.intersection.uv.y);
      socket.emit("message", "t");
    });

    text2.addEventListener("click", ev => {
      console.log("text2 ...");
      console.log(ev.detail.intersection.uv.x);
      console.log(ev.detail.intersection.uv.y);
      socket.emit("message", "click2 !!");
    });
  },
  tick: (t, dt) => {}
});
