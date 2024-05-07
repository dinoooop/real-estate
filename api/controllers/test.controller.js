import express from "express"

const router = express.Router()

// From 1.18.26

router.get("/test", (req, res) => {

    console.log("Server 100 is running!")

})

export default router