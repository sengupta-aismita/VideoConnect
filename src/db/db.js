import mongoose from "mongoose"

const connectDB = async()=>{
    try{
       await mongoose.connect(process.env.DB_URI)
       console.log("MongoDB succesfully connected");
       
    }catch(error){
       console.error("Error in connecting MongoDb", error)
       process.exit(1)
    }
}

export default connectDB