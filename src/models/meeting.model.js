import mongoose from "mongoose"

const meetingSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        lowercase: true,
        ref: "User"

    },
    meetingCode:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    date:{
        type:Date,
        default: Date.now(),
        required: true

    }
},{timestamps: true})

export const Meeting = mongoose.model("Meeting",meetingSchema )