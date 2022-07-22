import {useState} from 'react' 

const CreateNew = (props) => {
    const [newBlog, setNewBlog] = useState({title: '', author: '', url: ''})

    const addBlog = (e) => {
        e.preventDefault()
        props.handleCreate(newBlog)
        setNewBlog({title: '', author: '', url: ''})
    }

    return(
        <div>
            <h3>create new</h3>
             <form onSubmit={addBlog}>
        <label>
          title
            <input
            type="text"
            value={newBlog.title}
            name="Title"
            onChange={({ target }) => setNewBlog({...newBlog, title:target.value})}
          />
        </label>
        <label>
          author
            <input
            type="text"
            value={newBlog.author}
            name="Author"
            onChange={({ target }) => setNewBlog({...newBlog, author:target.value})}
            />
        </label>
        <label>
          url
            <input
            type="text"
            value={newBlog.url}
            name="Url"
            onChange={({ target }) => setNewBlog({...newBlog, url:target.value})}
            />
        </label>
        <button id="create-button" type="submit">create</button>
      </form>
        </div>
    )
}

export default CreateNew