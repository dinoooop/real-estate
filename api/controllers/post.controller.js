import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const index = async (req, res) => {
    const query = req.query
    try {
        const posts = await prisma.post.findMany({
            where: {
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                bedroom: parseInt(query.bedroom) || undefined,
                price: {
                    gte: parseInt(query.minPrice) || 0,
                    lte: parseInt(query.maxPrice) || 10000,
                }
            }
        })
        // setTimeout(() => { res.json(posts) }, 3000)
        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
}

export const show = async (req, res) => {
    const id = req.params.id
    try {
        const post = await prisma.post.findUnique({
            where: { id },
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


        const token = req.cookies?.token
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
                if (!err) {
                    const saved = await prisma.savedPost.findUnique({ 
                        where: { userId_postId: { userId: payload.id, postId: id } } 
                    })
                    res.json({ ...post, isSaved: saved ? true : false })
                }
            })
        } else {
            res.json({ ...post, isSaved: false })
        }

        


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