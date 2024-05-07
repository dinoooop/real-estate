import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt"

export const index = async (req, res) => {
    try {
        const posts = await prisma.post.findMany()
        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
}

export const show = async (req, res) => {
    try {

        const post = await prisma.post.findUnique({
            where: { id: req.params.id },
            include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true
                    }
                }
            }

        })
        res.json(post)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error : Show" })
    }
}

export const store = async (req, res) => {
    const userId = req.userId
    const body = req.body

    try {

        const post = await prisma.post.create({
            data: { 
                ...body.postData, 
                userId,
                postDetail: {
                    create: body.postDetail
                }
            }
        })

        res.json(post)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
}

export const update = async (req, res) => {
    const id = req.params.id
    const body = req.body

    try {
        const post = await prisma.post.update({
            where: { id },
            data: body
        })
        res.json(post)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
}

export const destroy = async (req, res) => {
    const id = req.params.id
    const userId = req.userId

    try {

        const post = await prisma.post.findUnique({ where: { id } })
        if (post.userId !== userId) {
            res.status(403).json({ message: "Unautherised action" })
        }
        await prisma.post.delete({ where: { id } })
        res.json({ message: "post deleted" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
}