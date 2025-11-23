import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

let onlineUsers: Map<string, string>;
let io: Server;

function setupSocket(server: HttpServer): void {
  onlineUsers = new Map<string, string>();

  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
    transports: ["websocket"],
  });

  io.on("connection", (socket: Socket) => {
    // Store the user ID with the socket ID
    socket.on("register_user", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      socket.join(userId);
    });

    socket.on("send_message", (data: any) => {
      data.chat.members.forEach((member: string) => {
        if (member !== data.sender._id) {
          socket.to(member).emit("new_message", data);
        }
      });
    });

    socket.emit("joinChat", (data: any) => {
      const { chatId, userId } = data;
      socket.join(chatId);
    });

    socket.on("check_online_users", (data: any) => {
      const { users } = data;
      const onlineUserIds = users.filter((user: string) =>
        onlineUsers.has(user)
      );
      const onlineUserSockets = onlineUserIds.map((userId: string) => ({
        userId,
        socketId: onlineUsers.get(userId),
      }));
      socket.to(socket.id).emit("online_users", onlineUserSockets);
    });

    socket.on("read_message", (data: any) => {
      socket.to(data.userId).emit("message_read", data);
    });

    socket.on("all_read_messages", (data: any) => {
      socket.to(data.userId).emit("all_messages_read", data);
    });

    socket.on("disconnect", () => {
      onlineUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
        }
      });
    });

    // notification
    socket.on("send_notification", (data: any) => {
      const { userId, notification } = data;
      if (onlineUsers.has(userId)) {
        io.to(userId).emit("receive_notification", notification);
      }
    });
  });
}

export { io, onlineUsers };

export default setupSocket;
