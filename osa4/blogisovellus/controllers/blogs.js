const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')



blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  })
  
  blogsRouter.post('/', async (request, response) => {
    if (request.body.title === undefined || request.body.url === undefined) {
        response.status(400).json('No title or url given')
    }
    else {
        const blog = new Blog(request.body)

        const token = request.token
        const userId = request.user?.id
        if (!token || !userId) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(userId)
        if(!blog.likes) blog.likes = 0
        blog.user = user._id
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)  
    }
  })

  blogsRouter.delete('/:id', async (request, response) => {
    const token = request.token
    const userId = request.user?.id
    if (!token || !userId) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(userId)
    const blog = await Blog.findById(request.params.id)
    if(blog === undefined) response.status(400).json('no blog found by given id')

    if(blog.user.toString() !== user._id.toString()) response.status(400).json('user not authorized to delete blog')

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()

  })

  blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body
    const id = request.params.id

    const updatedBlog = await Blog.findByIdAndUpdate(id, {title, author, url, likes}, { new: true, runValidators: true, context: 'query' })
    response.json(updatedBlog)
    

  })


module.exports = blogsRouter


