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
        const token = generateToken(newUser._id, res);
        await newUser.save();

        // Also send token in header for API clients
        res.setHeader('Authorization', `Bearer ${token}`);

        res.status(201).json({
            _id : newUser._id,
            fullName : newUser.fullName,
            email: newUser.email,
            profilePic:newUser.profilePic,
            token: token // Include token in response body
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
        const token = generateToken(user._id, res);
        
        // Also send token in header for API clients
        res.setHeader('Authorization', `Bearer ${token}`);

        // Log the success for debugging
        console.log(`User ${user._id} logged in successfully, token provided`);

        // Send success response
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            token: token // Include token in response body as well
        });
    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
  
// logout stuff
export const logout = (req,res) => {
    try {
        console.log("Logging out user");
        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/"
        });
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message:"Internal server error"}); 
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


export const checkAuth = (req,res) => {
    try {
        // Always send the token back in the response header
        const token = req.cookies.jwt || 
                     (req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null) ||
                     req.headers['x-auth-token'];
                     
        if (token) {
            res.setHeader('Authorization', `Bearer ${token}`);
        }
        
        // Log successful auth check
        console.log(`Auth check successful for user ${req.user._id}`);
        
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
