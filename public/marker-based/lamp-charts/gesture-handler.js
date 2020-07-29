let lampSwitcher = "off";

AFRAME.registerComponent("gesture-handler", {
  schema: {
    enabled: { default: true },
    rotationFactor: { default: 5 },
    minScale: { default: 0.3 },
    maxScale: { default: 8 },
  },

  init: function () {
    this.handleRotation = this.handleRotation.bind(this);

    this.isVisible = false;
    this.initialScale = this.el.object3D.scale.clone();

    this.el.sceneEl.addEventListener("markerFound", (e) => {
      this.isVisible = true;
    });

    this.el.sceneEl.addEventListener("markerLost", (e) => {
      this.isVisible = false;
    });
  },

  update: function () {
    if (this.data.enabled)
      this.el.sceneEl.addEventListener("onefingermove", this.handleRotation);
    else
      this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
  },

  remove: function () {
    this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
  },

  handleRotation: function (event) {
    if (this.isVisible) {
      lampSwitcher = lampSwitcher === "on" ? "off" : "on";

      this.el.removeAttribute("src");

      if (lampSwitcher === "off")
        this.el.setAttribute(
          "src",
          "https://cdn.glitch.com/a17e5232-ac73-44af-bd85-d94d4eb01043%2FlampOff.png?v=1595933974121"
        );
      else
        this.el.setAttribute(
          "src",
          "https://cdn.glitch.com/a17e5232-ac73-44af-bd85-d94d4eb01043%2FlampOn.png?v=1595933975516"
        );

      mySocket.socket.emit(
        "message",
        lampSwitcher === "on" ? "lampOn" : "lampOff"
      );
    }
  },
});
