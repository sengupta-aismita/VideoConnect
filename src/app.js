import express from "express"

const app = express();


app.get("/", (req,res)=>{
    res.send("Hello world");
})



//basic configurations
app.use(express.json("limit: 16kb")) //req body
app.use(express.urlencoded({extended:true,limit: "16kb"})) //form data
app.use(express.static("public") ) //static files


export default app