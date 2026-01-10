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

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
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

export const getUserHistory = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;

    if(!userId)
        throw new ApiError(401, "Unauthorized user");

    const meetings = await Meeting.find({user_id: userId })
    .sort({ createdAt: -1 });

    return res.status(200).json(
    new ApiResponse(200, "User history fetched successfully", meetings)
  );

})

export const addToHistory = asyncHandler(async(req,res)=>{
    
  const userId = req.user?._id;
  const { meeting_code } = req.body;

  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!meeting_code) throw new ApiError(400, "Meeting code required");

  const meeting = await Meeting.create({
    user_id: userId,
    meetingCode: meeting_code,
    date: new Date(),
  });


  return res
    .status(201)
    .json(new ApiResponse(201, "Added code to history", meeting));
})

export const createRoom = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    if(!userId) throw new ApiError(401, "User unauthorized");

    const meetingCode = crypto.randomBytes(4).toString("hex");

    const meeting = await Meeting.create({
        user_id: userId,
        meetingCode,
        date: new Date(),
    })

    return res.status(201).json(new ApiResponse(201, {meetingCode: meeting.meetingCode}, "Room has been created"))
})

export const joinMeeting = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    const {meetingCode} = req.body;

     if(!userId) throw new ApiError(401, "User unauthorized");
     if(!meetingCode) throw new ApiError(400, "Meeting code is required");

     await Meeting.findOneAndUpdate(
    { user_id: userId, meetingCode },
    { $set: { date: new Date() } },
    { upsert: true, new: true }
  );

  return res.status(200).json(new ApiResponse(200,{meetingCode}, "Joined meeting"))

})