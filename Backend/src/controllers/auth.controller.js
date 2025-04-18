import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/util.js"
import User from "../models/user.models.js"
import bcrypt from "bcryptjs"

export const signup =  async(req,res)=>{
   const{fullName,email,password}= req.body
   try {
    if(!fullName || !email || !password){
        return res.status(400).json({message:"All Fields are required"});
    }

    if(password.length < 6){
        return res.status(400).json({message:"Password should be atleast 6 charactro"})
    }
    const user = await User.findOne({email})

    if(user)return res.status(400).json({message:"User Already exists"})

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = new User({
        fullName,
        email,
        password:hashedPassword,
    })

    if(newUser){
        // generate web tokens here
        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            _id : newUser._id,
            fullName : newUser.fullName,
            email: newUser.email,
            profilePic:newUser.profilePic,
        })
    }
    else{
        return res.status(400).json({message:"Invalid User Field"})

    }

   } catch (error) {
    console.log("Error in signUp Controller", error.message);
    res.status(500).json({message:"Internal server error"})
   }
}


// LOGIN STUFF
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate token and set cookie
        generateToken(user._id, res);

        // Send success response
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
  
// logout stuff
export const logout =  (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in logn controller",error.message)
        res.status(500).json({message:"Internal server error "}) 
    }
}

/*profile stuff
1️⃣ User sends a request with a profilePic (Base64 or URL).
2️⃣ Backend checks if profilePic exists.
3️⃣ Image is uploaded to Cloudinary, and a URL is received.
4️⃣ User's profile is updated in the database with the new image URL.
5️⃣ Success response is sent with the updated user data.
6️⃣ If any error occurs, it is logged, and a 500 error is returned.

✅ If profilePic is missing → Returns 400 Bad Request.
✅ If Cloudinary fails → Should return a proper error (but your code doesn't handle this yet).
✅ If userId is invalid → The function might fail silently (needs better error handling).*/

export const updateProfile = async(req,res)=>{
    try {
        const{profilePic} = req.body
        const userId = req.user._id

        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {profilePic:uploadResponse.secure_url},
            {new: true }
        );

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("errror in update-profile",error);
        res.status(500).json({message:"Internal Server Errror"})
    }
}


export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller",error.message);
        res.send(500).json({message:"Internal Server Error"})
    }
}
