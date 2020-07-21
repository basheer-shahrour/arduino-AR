let oldDir = "";
let speed = 1;
let sendToServer = false;

AFRAME.registerComponent("gesture-handler", {
  schema: {
    enabled: { default: true },
    rotationFactor: { default: 5 },
    minScale: { default: 0.3 },
    maxScale: { default: 8 },
  },

  init: function () {
    this.handleScale = this.handleScale.bind(this);
    this.handleRotation = this.handleRotation.bind(this);

    this.isVisible = false;
    this.initialScale = this.el.object3D.scale.clone();
    this.scaleFactor = 1;

    this.el.sceneEl.addEventListener("markerFound", (e) => {
      this.isVisible = true;
    });

    this.el.sceneEl.addEventListener("markerLost", (e) => {
      this.isVisible = false;
    });
  },

  update: function () {
    if (this.data.enabled) {
      this.el.sceneEl.addEventListener("onefingermove", this.handleRotation);
      this.el.sceneEl.addEventListener("twofingermove", this.handleScale);
    } else {
      this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
      this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
    }
  },

  remove: function () {
    this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
    this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
  },

  handleRotation: function (event) {
    if (this.isVisible) {
      this.el.object3D.rotation.y +=
        event.detail.positionChange.x * this.data.rotationFactor;
      this.el.object3D.rotation.x +=
        event.detail.positionChange.y * this.data.rotationFactor;

      if (oldDir != "left" && event.detail.positionChange.x < 0) {
        if (sendToServer) mySocket.socket.emit("message", "fanLeft");
        oldDir = "left";
      } else if (oldDir != "right" && event.detail.positionChange.x > 0) {
        if (sendToServer) mySocket.socket.emit("message", "fanRight");
        oldDir = "right";
      }
    }
  },

  handleScale: function (event) {
    if (this.isVisible) {
      this.scaleFactor *=
        1 + event.detail.spreadChange / event.detail.startSpread;
      if (speed != 1 && this.scaleFactor >= 0.5 && this.scaleFactor < 1) {
        if (sendToServer) mySocket.socket.emit("message", "fanSpeed_1");
        speed = 1;
      } else if (
        speed != 2 &&
        this.scaleFactor >= 1 &&
        this.scaleFactor < 1.5
      ) {
        if (sendToServer) mySocket.socket.emit("message", "fanSpeed_2");
        speed = 2;
      } else if (speed != 3 && this.scaleFactor >= 1.5) {
        if (sendToServer) mySocket.socket.emit("message", "fanSpeed_3");
        speed = 3;
      }
      this.scaleFactor = Math.min(
        Math.max(this.scaleFactor, this.data.minScale),
        this.data.maxScale
      );

      this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;
      this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;
      this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
    }
  },
});
