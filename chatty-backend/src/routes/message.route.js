import express from "express";
import { upload } from "../middlewares/multer.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

import {
    getUsersForSidebar,
    getMessages,
    sendMessage
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/all-users",protectRoute,getUsersForSidebar)
router.get("/:userId", protectRoute, getMessages);
router.route("/send/:receiverId").post(
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    protectRoute,
    sendMessage
);

export default router;