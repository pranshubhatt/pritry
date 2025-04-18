import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  console.log("Setting JWT cookie for user:", userId);
  
  // Simplify cookies for debugging
  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in MS
    httpOnly: true,
    // Temporarily disable these for debugging
    // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    // secure: process.env.NODE_ENV === "production",
    path: "/"
  });

  return token;
};
