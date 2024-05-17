import express from "express"
import { index, show, store, update } from "../controllers/message.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()


router.post("/:chatId", verifyToken, store)


export default router