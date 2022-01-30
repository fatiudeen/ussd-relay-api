dotenv.config()
import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import router from './routes/request.js'
import cors from 'cors';

const app = express()
var server = http.createServer(app)
// io initialization
const io = new Server(server, {
  cors: {
    // origin: "http://fathomless-shore-12392.herokuapp.com/",//socketUrl,
    origin: "http://localhost:3000/",//socketUrl,
    method: ["GET", "POST"]
  }
})
//middlewares 
app.use(function (req, res, next) {
  req.io = io;
  next();
})
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//routes
app.use("/api", router)

// Database configuration
mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Successfully Connected"))
  .catch((err) => console.log(err))


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
io.on("connection", socket => {

  console.log(`Socket connected ${socket.id}`)

  socket.on('join_room', payload => {
    socket.join(payload);
  })

  socket.on('message_sent', payload => {
    socket.to(payload.room).emit('message_recieved', payload)
    console.log('Emit worked')
  })

  socket.on("disconnect", () => {
    console.log("User disconnected from socket.")
  })
})
