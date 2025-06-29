import express from "express";
import { upload } from "../middlewares/multer.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { 
    signup,
    login,
    logout,
    updateProfile,
    checkLoggedIn
} from "../controllers/auth.controller.js";

const router = express.Router();

// routes
router.post("/signup", signup);
router.post("/login",login);
router.post("/logout", logout);
router.route("/update-profile").put(
    upload.fields([
        {
            name: "profilePic",
            maxCount: 1
        }
    ]),
    protectRoute,
    updateProfile
);
router.get("/check-loggedIn" , protectRoute, checkLoggedIn);

export default router;