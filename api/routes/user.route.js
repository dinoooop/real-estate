import express from "express"
import { index, show, store, update, destroy, savePost, profilePosts } from "../controllers/user.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()

router.get("/", index)
router.get("/profilePosts", verifyToken, profilePosts)
router.get("/:id", verifyToken, show)
router.post("/", verifyToken, store)
router.put("/:id", verifyToken, update)
router.delete("/:id", verifyToken, destroy)
router.post("/save", verifyToken, savePost)

export default router