import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt"

export const index = async (req, res) => {

    const tokenUserId = req.params.id
    try {

        const users = await prisma.chat.findMany({
            where: {
                userIDs: {
                    hasSome: [tokenUserId]
                }
            }
        })
        res.json(users)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
}

export const show = async (req, res) => {
    try {

        const user = await prisma.user.findUnique({
            where: { id: req.params.id }
        })
        res.json(user)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error : Show" })
    }
}

export const store = async (req, res) => {
    const tokenUserId = req.userId
    const chatId = req.params.chatId
    const text = req.body.text
    try {

        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId,
                userIDs: {
                    hasSome: [tokenUserId]
                }
            }
        })

        if (!chat) return res.status(404).json({ message: "Chat not found" })

        const message = await prisma.message.create({
            data: {
                text,
                chatId,
                userId: tokenUserId
            }
        })

        await prisma.chat.update({
            where: { 
                id: chatId 
            },
            data: { 
                seenBy: [tokenUserId], 
                lastMessage: text
            }
        })

        res.json(message)


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
}

export const update = async (req, res) => {
    const id = req.params.id
    const userId = req.userId
    const body = req.body

    if (id !== userId) {
        res.status(403).json({ message: "Forbindden" })
    }

    if (body.password == "") {
        delete body.password
    }

    if (body.password && body.password !== "") {
        body.password = await bcrypt.hash(body.password, 10)
    }

    try {
        const user = await prisma.user.update({
            where: { id },
            data: body
        })
        delete user.password
        res.json(user)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
}

