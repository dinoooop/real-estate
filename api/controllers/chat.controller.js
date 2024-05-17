import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt"

export const index = async (req, res) => {

    const tokenUserId = req.userId
    try {

        const chats = await prisma.chat.findMany({
            where: {
                userIDs: {
                    hasSome: [tokenUserId]
                }
            }
        })

        for (const chat of chats) {
            const receiverId = chat.userIDs.find((id) => id !== tokenUserId)
            const receiver = await prisma.user.findUnique({
                where: {
                    id: receiverId
                },
                select: {
                    id: true,
                    username: true,
                    avatar: true
                }
            })
            chat.receiver = receiver

        }

        res.json(chats)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
}

export const show = async (req, res) => {
    const tokenUserId = req.userId

    try {
        const chat = await prisma.chat.findUnique({
            where: {
                id: req.params.id,
                userIDs: {
                    hasSome: [tokenUserId]
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        })

        await prisma.chat.update({
            where: { id: req.params.id },
            data: {
                seenBy: {
                    push: [tokenUserId]
                }
            }

        })
        res.json(chat)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error : Show" })
    }
}

export const store = async (req, res) => {
    const tokenUserId = req.userId
    const body = req.body

    try {

        const chat = await prisma.chat.create({
            data: {
                userIDs: [tokenUserId, body.receiverId]
            }
        })

        res.json(chat)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }

}

export const update = async (req, res) => {
    const tokenUserId = req.userId
    const body = req.body

    try {
        const chat = await prisma.chat.update({
            where: {
                id: req.params.id,
                userIDs: {
                    hasSome: [tokenUserId]
                }
            },
            data: {
                seenBy: {
                    push: [tokenUserId]
                }
            }

        })
        res.json(chat)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
}

