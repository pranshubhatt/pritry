import express from "express"
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup" ,signup)
router.post("/login" ,login)
router.post("/logout",logout)
router.put("/update-profile",protectRoute, updateProfile)    //The protectRoute will work as an middlelayer (which ensures that if the user is authenticated then only it can change the profile pic )
router.get("/check",protectRoute,checkAuth)

export default router   