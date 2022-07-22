import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CreateNew from './CreateNew'
import userEvent from '@testing-library/user-event'

test('<CreateNew /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const handleCreate = jest.fn()

  render(<CreateNew handleCreate={handleCreate} />)
  
  const titleInput = screen.getByLabelText('title')
  const authorInput = screen.getByLabelText('author')
  const urlInput = screen.getByLabelText('url')

  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'Testibloggerson')
  await user.type(authorInput, 'Venlamo')
  await user.type(urlInput, 'www.venlamonsivut.fi')

  await user.click(sendButton)

  expect(handleCreate.mock.calls).toHaveLength(1)
  expect(handleCreate.mock.calls[0][0].title).toBe('Testibloggerson')
  expect(handleCreate.mock.calls[0][0].author).toBe('Venlamo')
  expect(handleCreate.mock.calls[0][0].url).toBe('www.venlamonsivut.fi')
})