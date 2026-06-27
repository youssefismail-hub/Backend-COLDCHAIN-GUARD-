const { verify } = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("./models/userModel");

let io;

function getAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGIN || "http://localhost:3000,http://localhost:8081";
  if (raw === "*") return "*";
  return raw.split(",").map((origin) => origin.trim()).filter(Boolean);
}

module.exports = {
  init: (server) => {
    const allowedOrigins = getAllowedOrigins();

    io = require("socket.io")(server, {
      cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
      },
    });

    io.use(async (socket, next) => {
      try {
        const authHeader = socket.handshake.headers.authorization;
        const headerToken = authHeader?.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : null;
        const token = socket.handshake.auth?.token || headerToken;

        if (!token) {
          return next(new Error("Authentication required"));
        }

        const decoded = await promisify(verify)(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
          return next(new Error("User not found"));
        }

        socket.user = user;
        next();
      } catch (error) {
        next(new Error("Authentication failed"));
      }
    });

    io.on("connection", (socket) => {
      socket.on("join_company", (companyId) => {
        if (!companyId || !socket.user?.company) {
          return;
        }

        if (socket.user.company.toString() !== companyId.toString()) {
          socket.emit("socket_error", { message: "Access denied for this company room." });
          return;
        }

        socket.join(companyId.toString());
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },

  getAllowedOrigins,
};
