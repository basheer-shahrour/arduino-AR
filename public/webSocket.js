class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io.connect("https://969c5500f235.ngrok.io");
    this.socket.on("connect", () => console.log("connection sucssed ..."));
  }
}
