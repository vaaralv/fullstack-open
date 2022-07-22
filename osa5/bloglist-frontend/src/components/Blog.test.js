import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'


test('renders content', () => {
  const blog = {
    title: 'Testiplogi',
    author: 'Venla Mandoliini',
    url: 'www.vempula.fi',
    likes: 50
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Testiplogi Venla Mandoliini')
  expect(element).toBeDefined()
})

test('clicking the button shows url and likes', async () => {
    const blog = {
        title: 'Testiplogi',
        author: 'Venla Mandoliini',
        url: 'www.vempula.fi',
        likes: 50
      }
  
  
    render(
      <Blog blog={blog} />
    )
  
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
  
    const url = screen.getByText('www.vempula.fi')
    const likes = screen.getByText('likes: 50')
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
  })

  test('clicking the button twice calls event handler twice', async () => {
    const blog = {
        title: 'Testiplogi',
        author: 'Venla Mandoliini',
        url: 'www.vempula.fi',
        likes: 50
      }
  
    const mockHandler = jest.fn()
  
    render(
        <Blog blog={blog} handleLike={mockHandler}/>
      )
    
  
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
  
    expect(mockHandler.mock.calls).toHaveLength(2)
  })