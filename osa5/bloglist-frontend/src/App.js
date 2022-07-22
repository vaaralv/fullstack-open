import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import CreateNew from './components/CreateNew'
import blogService from './services/blogs'
import loginService from './services/login'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [sortedBlogs, setSortedBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [createVisible, setCreateVisible] = useState(false)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    setSortedBlogs(blogs.sort((a,b) => b.likes - a.likes))
  }, [blogs])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification('wrong credentials')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const handleCreate = newBlog => {
    try {
      blogService.create(newBlog).then(() => setBlogs(blogs.concat(newBlog)))
      setNotification(`new blog ${newBlog.title} added`)
      setCreateVisible(false)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exeption) {
      setNotification(`problem occurred, no new blog added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLike = blog => {
    try {
      blogService.update(blog.id, {...blog, likes: blog.likes + 1}).then(() => {
        const updateBlog = blogs.find(b => b.id === blog.id)
        if(updateBlog) setBlogs(blogs.map(b => b.id === blog.id ? {...blog, likes: blog.likes + 1}: b))
        setNotification(`added like to blog ${blog.title}`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      
    } catch (exeption) {
      setNotification(`problem occurred, no like added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleRemove = blog => {
    console.log(blog.user)
    try {
      if(window.confirm(`Are you sure you want to delete blog ${blog.title} by ${blog.author}?` )){
        blogService.remove(blog.id).then(() => {
          setBlogs(blogs.filter(b => b.id !== blog.id))
          setNotification(`Blog ${blog.title} deleted`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        })
      }
    } catch {
      setNotification(`problem occurred, blog not deleted`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const hideWhenVisible = { display: createVisible ? 'none' : '' }
  const showWhenVisible = { display: createVisible ? '' : 'none' }

  return (
    <div>
      {user === null ?
            <div>
              <p>{notification}</p>
              <Login setUsername={setUsername} setPassword={setPassword} password={password} username={username} handleLogin={handleLogin}/>
            </div>

    :
    <div>
      <h2>blogs</h2>
      <p>{notification}</p>
      <p>{user.name} logged in <button onClick={() => handleLogout()}>log out</button></p>
      <button style={hideWhenVisible} onClick={() => setCreateVisible(true)}>add new blog</button>
      <div style={showWhenVisible}>
      <CreateNew handleCreate={handleCreate} />
      <button onClick={() => setCreateVisible(false)}>cancel</button>
      </div>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemove={handleRemove} loggedInUser={user}/>
      )}
    </div>
    }
   
    </div>
  )
}

export default App
