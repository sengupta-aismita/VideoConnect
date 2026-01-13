import express from "express"
import cors from "cors"
import healthCheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js"
import { errorHandler } from "./middlewares/error.js";



const app = express();



app.get("/", (req,res)=>{
    res.send("Hello world");
})






//basic configurations
app.use(express.json({ limit: "16kb" })) //req body
app.use(express.urlencoded({extended:true,limit: "16kb"})) //form data
app.use(express.static("public") ) //static files
app.use(errorHandler);


//cors configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"]
}))



app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/auth", userRouter)
app.use(errorHandler);

export default app