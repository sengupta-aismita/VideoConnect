import dotenv from "dotenv"
import app from "./app.js"
import connectDB from "./db/db.js"
import { createServer } from 'node:http';
import { connectToSocket } from "./controllers/socketManager.js";

dotenv.config({
    "path": "./.env"
})




const port = process.env.PORT
const server = createServer(app);
connectToSocket(server);


connectDB()
.then(()=>{
    server.listen(port, ()=>{
    console.log(`Server is listening at http://localhost:${port}/`);
    
})
})
.catch((err)=>{
     console.error("MongoDB connection error",err);
    process.exit(1);
})



