 import jwt from "jsonwebtoken"
import User from "../models/user.models.js"

export const   protectRoute = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message:"Unauthorized - No Token Provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({message:"Unauthorized - Invalid token"})   
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({message:"User not faond"})   
        }

        req.user = user;
        next()
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({message:"Internal server error"})
    }
};

/*
1️⃣ User makes a request to a protected route (e.g., /api/profile).
2️⃣ protectRoute middleware checks if a token exists in cookies.
3️⃣ If no token is found, a 401 Unauthorized error is returned.
4️⃣ If a token exists, it is verified using jwt.verify().
5️⃣ If verification fails, an error is returned.
6️⃣ If verification succeeds, the user’s ID is extracted from the token.
7️⃣ The user is looked up in the database.
8️⃣ If the user does not exist, a 401 Unauthorized error is returned.
9️⃣ If the user is found, their data (excluding the password) is attached to req.user.
🔟 next(); is called, allowing the request to proceed to the protected route handler. 
*/

