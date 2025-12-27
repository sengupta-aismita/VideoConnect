import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-errors.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Meeting } from "../models/meeting.model.js"
import bcrypt, { hash } from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

export const login = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body

    if (!identifier || !password) {
        throw new ApiError(400, "Please provide username/email and password")
    }

    const user = await User.findOne({
        $or: [{ username: identifier }, { email: identifier }],
    }).select("+password")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid username/email or password");
  }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    })

    return res.status(200).json(
        new ApiResponse(200, "Login successful", {
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        })
    )
})


export const register = asyncHandler(async(req,res)=>{
    const {name, username, email,password} = req.body;

   if (!username || !password ||!email) {
        throw new ApiError(400, "Please provide username,email and password")
    }

    const existUser = await User.findOne({
    $or: [{username}, {email}]
   })

    if (existUser) {
        throw new ApiError(409, "User already exists")
    }

    const user = await User.create({
        email,
        password,
        username,
        fullName:name,
        isEmailVerified:false
    })

    return res.status(201).json(new ApiResponse(201, "User registered successfully", {
      id: user._id,
      username: user.username,
      email: user.email,
    }))

})