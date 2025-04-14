import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js" 

import path from "path";

import { connectDB } from "./lib/db.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve()

dotenv.config();
app.use(cors({
         origin :'http://localhost:5173',
         credentials:true,
    })
);

app.use(express.json({ limit: '10mb' })) // or more, like '50mb'
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())   //allows us to extract the json data out of the body

app.use("/api/auth" , authRoutes);
app.use("/api/messages" , messageRoutes); 

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../Frontend/dist")));
      
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
    });
  }


const PORT = process.env.PORT |4000 //this is how we can read .env file content
server.listen(PORT, ()=>{
    console.log("Server is running on PORT:"+PORT)
    connectDB();
})