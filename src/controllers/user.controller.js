import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadFileOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, fullName } = req.body
    // console.log("Email", email)

    //  check for empty fields
    if([username, email, password, fullName].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    //  check if user already exists
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with this email or username already exists")
    }


    // get file paths from local server
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }


    //  upload files on cloudinary from local server
    const avatar = await uploadFileOnCloudinary(avatarLocalPath)
    const coverImage = await uploadFileOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }


    //  create an entry of user in the database
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password
    })

    //  check if user is created or not
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500, "Sorry! something went wrong while creating a user")
    }

    //  return response if user is created
    return res.status(201).json(
        new ApiError(201, createdUser, "User created successfully")
    )
})

export { registerUser }