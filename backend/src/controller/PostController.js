const Post = require('../models/Post')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')


module.exports = {
    async index(req, res) {

        const post = await Post.find().sort('-createdAt')

        res.json(post)

    },

    async store(req, res) {

        const { author, place, description, hashtags } = req.body
        const { filename: image } = req.file

        const [name] = image.split('.')
        const fileName = `${name}.jpg`

        await sharp(req.file.path)
            .resize(500)
            .jpeg({ quality: 70 })
            .toFile(
                path.resolve(req.file.destination, 'resized', fileName)
            )

        fs.unlinkSync(req.file.path)            

        const post = await Post.create({
            author,
            description,
            place,
            hashtags,
            image: fileName
        })

        req.io.emiit('post', post)

        res.json(post)


    }

}