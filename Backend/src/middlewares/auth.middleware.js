import jwt from "jsonwebtoken"
import User from "../models/user.models.js"

export const protectRoute = async (req, res, next) => {
    try {
        console.log("================== Auth Request ==================");
        console.log("Headers:", {
            authorization: req.headers.authorization ? 'exists' : 'none',
            'x-auth-token': req.headers['x-auth-token'] ? 'exists' : 'none',
            cookie: req.headers.cookie ? 'exists' : 'none'
        });
        console.log("Cookies:", req.cookies);
        
        // Get token from various sources
        const tokenFromCookie = req.cookies?.jwt;
        
        // Handle Authorization header with more flexibility
        let tokenFromHeader = null;
        const authHeader = req.headers.authorization;
        if (authHeader) {
            // Handle 'Bearer token' format
            if (authHeader.startsWith('Bearer ')) {
                tokenFromHeader = authHeader.split(' ')[1];
            } 
            // Handle raw token format
            else if (authHeader.match(/^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/)) {
                tokenFromHeader = authHeader;
            }
        }
        
        const tokenFromCustomHeader = req.headers['x-auth-token'];
        
        // Choose the first available token
        const token = tokenFromCookie || tokenFromHeader || tokenFromCustomHeader;
        
        console.log("Token sources:", {
            cookie: tokenFromCookie ? 'present' : 'absent',
            header: tokenFromHeader ? 'present' : 'absent',
            customHeader: tokenFromCustomHeader ? 'present' : 'absent',
            finalToken: token ? 'found' : 'not found'
        });

        if (!token) {
            console.log("No token found in any source");
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Token decoded successfully:", decoded);

            const user = await User.findById(decoded.userId).select("-password");

            if (!user) {
                console.log("User not found");
                return res.status(401).json({ message: "User not found" });
            }

            req.user = user;
            
            // Set token in response header for consistent token propagation
            res.setHeader('Authorization', `Bearer ${token}`);
            
            next();
        } catch (jwtError) {
            console.log("JWT verification error:", jwtError.message);
            
            // Clear the invalid cookie
            res.cookie("jwt", "", {
                maxAge: 0,
                httpOnly: true,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                secure: process.env.NODE_ENV === "production",
                path: "/"
            });
            
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(401).json({ message: "Unauthorized - Internal error" });
    }
};

/*
1️⃣ User makes a request to a protected route (e.g., /api/profile).
2️⃣ protectRoute middleware checks if a token exists in cookies.
3️⃣ If no token is found, a 401 Unauthorized error is returned.
4️⃣ If a token exists, it is verified using jwt.verify().
5️⃣ If verification fails, an error is returned.
6️⃣ If verification succeeds, the user's ID is extracted from the token.
7️⃣ The user is looked up in the database.
8️⃣ If the user does not exist, a 401 Unauthorized error is returned.
9️⃣ If the user is found, their data (excluding the password) is attached to req.user.
🔟 next(); is called, allowing the request to proceed to the protected route handler. 
*/

