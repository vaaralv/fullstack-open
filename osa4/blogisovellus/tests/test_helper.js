const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
    {
        title: "React Patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 1,
        __v: 0
      },
      {
        title: "HTML is easy",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 1,
        __v: 0
      },
]

const nonExistingId = async () => {
  const blog = new Blog( {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 3,
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const notes = await Blog.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }
  
  module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    usersInDb,
  }