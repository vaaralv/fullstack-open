const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

jest.setTimeout(10000)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await api.post('/api/users').send({username: 'jrantala', name: 'Johannes R', password: 'jrantala'})
  })

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs    ')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})
  
test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)
  
    expect(contents).toContain(
      'React Patterns'
    )
  })

test('login returns token', async () => {
    const user = {username: 'jrantala', password: 'jrantala'}

   const response = await api.post('/api/login').send(user)
   const token = await response.body.token

   expect(token).toBeDefined()
})  

test('a valid blog can be added ', async () => {
    const newBlog =   {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 3,
      }

      const response = await api.post('/api/login').send({username: 'jrantala', password: 'jrantala'})

      const token = await response.body.token
      
     await api
      .post('/api/blogs')
      .set({'Content-Type': 'application/json', 'Authorization': `bearer ${token}`})
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(n => n.title)

  
    expect(titles).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(
      'First class tests'
    )
  })

  test('all blogs have property id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach(blog => expect(blog.id).toBeDefined())
  })

  test('a blog cannot be added without token ', async () => {
    const newBlog =   {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 3,
      }
      
     await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('a new blog with no likes field given is given 0 likes ', async () => {
    const newBlog =   {
        title: "No likes given",
        author: "Venla V",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      }

      const response = await api.post('/api/login').send({username: 'jrantala', password: 'jrantala'})

      const token = await response.body.token
  
    await api
      .post('/api/blogs')
      .set({'Content-Type': 'application/json', 'Authorization': `bearer ${token}`})
      .send(newBlog)
  
      const blogsAtEnd = await helper.blogsInDb()
      const addedBlog = blogsAtEnd.find(blog => blog.title === "No likes given" )
      expect(addedBlog.likes).toBe(0)
})

test('adding blog with no title or url results in status 400 ', async () => {
    const newBlog =   {
        author: "Venla V",
      }
  
      const response = await api.post('/api/login').send({username: 'jrantala', password: 'jrantala'})

      const token = await response.body.token

    await api
      .post('/api/blogs')
      .set({'Content-Type': 'application/json', 'Authorization': `bearer ${token}`})
      .send(newBlog)
      .expect(400)
      
})

test('a blog can be deleted by user who added it', async () => {
    const newBlog =   {
        title: "Poistettava",
        author: "Robban",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 3,
      }

      const response = await api.post('/api/login').send({username: 'jrantala', password: 'jrantala'})

      const token = await response.body.token
      
     await api
      .post('/api/blogs')
      .set({'Content-Type': 'application/json', 'Authorization': `bearer ${token}`})
      .send(newBlog)

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart.find(blog => blog.title === 'Poistettava')
    expect(blogToDelete).toBeDefined()
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({'Content-Type': 'application/json', 'Authorization': `bearer ${token}`})
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      blogsAtStart.length - 1
    )
  
    const titles = blogsAtEnd.map(r => r.title)
  
    expect(titles).not.toContain(blogToDelete.content)
  })

  test('a blog can not be deleted by user other than who added it', async () => {
    const newBlog =   {
        title: "Poistettava",
        author: "Robban",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 3,
      }

      const response = await api.post('/api/login').send({username: 'jrantala', password: 'jrantala'})

      const token = await response.body.token
      
     await api
      .post('/api/blogs')
      .set({'Content-Type': 'application/json', 'Authorization': `bearer ${token}`})
      .send(newBlog)

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart.find(blog => blog.title === 'Poistettava')
    expect(blogToDelete).toBeDefined()

    const response2 = await api.post('/api/login').send({username: 'vvaarala', password: 'vvaarala'})

    const token2 = await response2.body.token
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({'Content-Type': 'application/json', 'Authorization': `bearer ${token2}`})
      .expect(401)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      blogsAtStart.length
    )
  
    const titles = blogsAtEnd.map(r => r.title)
  
    expect(titles).not.toContain(blogToDelete.content)
  })

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({...blogToUpdate, likes: 70})

        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
        expect(updatedBlog.likes).toBe(70)

  })

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({...blogToUpdate, likes: 70})

        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
        expect(updatedBlog.likes).toBe(70)

  })


afterAll(() => {
  mongoose.connection.close()
})