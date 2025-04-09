const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ Cho phép mọi nguồn truy cập (có thể thu hẹp sau)
  },
});

io.on("connection", (socket) => {
  //   console.log(socket);
  console.log(
    `🔌 Client connected: ${socket.id} from: ${socket.handshake.headers["sec-ch-ua-platform"]}`
  );

  // Nhận offer và broadcast cho người còn lại
  socket.on("offer", (offer) => {
    console.log("📤 Offer từ:", socket.id);
    socket.broadcast.emit("offer", offer);
  });

  // Nhận answer và broadcast lại
  socket.on("answer", (answer) => {
    console.log("📤 Answer từ:", socket.id);
    socket.broadcast.emit("answer", answer);
  });

  // ICE Candidate
  socket.on("ice-candidate", (candidate) => {
    console.log("📡 ICE candidate");
    socket.broadcast.emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Server chạy ở cổng 5000
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ Signaling server đang chạy tại http://localhost:${PORT}`);
});

app.get("/", function (req, res) {
  console.log("hello world");
  res.send("hello world");
});
