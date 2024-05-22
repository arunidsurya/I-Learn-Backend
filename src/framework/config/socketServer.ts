import { Server as socketIOServer } from "socket.io";
import http from "http";

export const initSocketServer = (server: http.Server) => {
  const io = new socketIOServer(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
  });


  io.on("connection", (socket) => {
    console.log("A user is connected");

    socket.on("join_session",(data)=>{
        console.log("reached here");
        
        socket.join(data.courseId);
        console.log(`user logged with ${data.courseId}`);
        
        
    })

    socket.on("live-chat", (data) => {
    //     console.log(data);   
    // //   socket.broadcast.emit("receive_message", data);
      socket.to(data.courseId).emit("receive_message", data);
    });

        socket.on("notification", (data) => {
              console.log(data);
            socket.broadcast.emit("receive_notification", data);
          // socket.to(data.courseId).emit("receive_message", data);
        });

    socket.on("disconnect", () => {
      console.log("A user is disconnected");
    });
  });
};
