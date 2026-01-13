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
        
    },
    date:{
        type:Date,
        default: Date.now,
        required: true

    }
},{timestamps: true})

meetingSchema.index({ user_id: 1, meetingCode: 1 }, { unique: true });

export const Meeting = mongoose.model("Meeting",meetingSchema )