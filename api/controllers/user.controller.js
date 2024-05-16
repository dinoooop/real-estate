import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt"

export const index = async (req, res) => {
    try {

        const users = await prisma.user.findMany()
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
    try {

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

export const destroy = async (req, res) => {
    try {
        await prisma.user.delete({
            where: { id: req.params.id }
        })
        res.json({ message: "User deleted" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
}


export const savePost = async (req, res) => {
    const postId = req.body.postId
    const tokenUserId = req.userId
    try {

        const savedPost = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId: tokenUserId,
                    postId,
                }
            }
        })

        if (savedPost) {
            await prisma.savedPost.delete({
                where: {
                    id: savePost.id
                }
            })
            res.json({ message: "Post removed from the saved list" })
        } else {
            await prisma.savedPost.create({
                data: { userId: tokenUserId, postId }
            })
            res.json({ message: "Post saved" })

        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
}

export const profilePosts = async (req, res) => {
    try {
        const tokenUserId = req.params.userId
        const userPosts = await prisma.post.findMany({
            where: { userId: tokenUserId }
        })
        const saved = await prisma.savedPost.findMany({
            where: { userId: tokenUserId },
            include: {
                post: true
            }
        })
        const savedPosts = saved.map(item => item.post)
        res.json({ userPosts, savedPosts })

    } catch (error) {
        console.log(error);
    }
}