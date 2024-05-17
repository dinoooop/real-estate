import express from "express"
import { index, show, store, update } from "../controllers/chat.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()

router.get("/", verifyToken, index)
router.get("/:id", verifyToken, show)
router.post("/", verifyToken, store)
router.put("/:id", verifyToken, update) // use this to update chat as read
// router.delete("/:id", verifyToken, destroy)


export default router