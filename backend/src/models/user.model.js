import mongoose from "mongoose"
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true, 
        unique:true,
        index: true,
        trim: true,
        lowercase: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
         trim: true,
    }, 
      fullName:{
        type: String,
        trim: true
      },
    password:{
        type: String,
        required: [true, "Password is required!"],
        select:false
    },
    isEmailVerified:{
        type: Boolean,
        default: false
      }
}, {timestamps:true})

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return 
  this.password = await bcrypt.hash(this.password, 10)
  
})

UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", UserSchema)

