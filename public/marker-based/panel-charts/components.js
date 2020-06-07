let box1State = "red";
let box2State = "red";

AFRAME.registerComponent("box1-clickable", {
  init: function () {
    const el = this.el;
    el.addEventListener("click", (e) => {
      box1State = box1State === "green" ? "red" : "green";
      el.setAttribute("material", `color: ${box1State};`);
      socket.emit("message", "btn1");
      console.log("clicked");
    });
  },
});

AFRAME.registerComponent("box2-clickable", {
  init: function () {
    const el = this.el;
    el.addEventListener("click", (e) => {
      box2State = box2State === "green" ? "red" : "green";
      el.setAttribute("material", `color: ${box2State};`);
      console.log("clicked");
    });
  },
});
