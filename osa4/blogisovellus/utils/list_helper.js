const blog = require("../models/blog")

const dummy = (blogs) => {
    return(1)
  }
  
  const totalLikes = (blogs) => {
      if(blogs.length === 0) return 0
      else if(blogs.length === 1) return blogs[0].likes
    else return(blogs.map(blog => blog.likes).reduce((a, b) => a + b, 0))
  }

  const favoriteBlog = (blogs) => {
  
    const maxLikes = blogs.map(blog => blog.likes).reduce((a,b) => Math.max(a,b), 0)
    const result = blogs.find(blog => blog.likes === maxLikes)

    if(blogs.length === 0) return {}
    else if(blogs.length === 1) return blogs[0]
    else return result
  }

const mostBlogs = (blogs) => {
    let i = 0
    let authors = {}

    while(i < blogs.length){
        const blogAuthor = (i) => blogs[i].author

        if(authors[blogAuthor(i)]) authors[blogAuthor(i)] += 1
        else authors[blogAuthor(i)] = 1
        i++
    }

    const maxBlogsAuthor = Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b)
    const result = {author: maxBlogsAuthor, blogs: authors[maxBlogsAuthor]}

    if(blogs.length === 0) return {}
    else if(blogs.length === 1) return {author: blogs[0].author, blogs: 1}
    else return result
}

const mostLikes = (blogs) => {
    let i = 0
    let authors = {}

    while(i < blogs.length){
        const blogAuthor = (i) => blogs[i].author

        if(authors[blogAuthor(i)]) authors[blogAuthor(i)] += blogs[i].likes
        else authors[blogAuthor(i)] = blogs[i].likes
        i++
    }

    const maxLikesAuthor = Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b)
    const result = {author: maxLikesAuthor, likes: authors[maxLikesAuthor]}

    if(blogs.length === 0) return {}
    else if(blogs.length === 1) return {author: blogs[0].author, likes: blogs[0].likes}
    else return result
}

  module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
  }

