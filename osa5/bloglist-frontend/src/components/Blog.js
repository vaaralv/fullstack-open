import {useState} from 'react'

const Blog = ({handleLike, blog, handleRemove, loggedInUser}) => {
  const [show, setShow] = useState(false)

  return(
  <div id="blog" style={{border: 'solid 1px black', margin: 4}}>
    {blog.title} {blog.author} <button id="view-button" onClick={() => setShow(!show)}>{show ? 'hide' : 'view'}</button>
    {show && blog.url && <div>{blog.url}</div>}
    {show && <div>likes: {blog.likes} <button id="like-button" onClick={() => handleLike(blog)}>like</button></div>}
    {show && blog.user && blog.user.name}
    {loggedInUser && blog.user && loggedInUser.username === blog.user.username &&
    <button id="delete-button" onClick={() => handleRemove(blog)}>delete</button>}

  </div>  

  )
  }

export default Blog