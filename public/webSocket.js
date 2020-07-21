class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io.connect("http://localhost:3030");
    this.socket.on("connect", () => console.log("connection sucssed ..."));
    this.socket.on("message", (data) => console.log(data));
  }
}
const mySocket = new SocketService();
mySocket.connect();
