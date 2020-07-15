let lampSwitcher = "red";

AFRAME.registerComponent("lamp-switcher", {
  init: function () {
    const el = this.el;
    el.addEventListener("click", () => {
      lampSwitcher = lampSwitcher === "green" ? "red" : "green";
      el.setAttribute("material", `color: ${lampSwitcher};`);
      socket.emit("message", lampSwitcher === "green" ? "lampOn" : "lampOff");
      console.log("clicked");
    });
  },
});
