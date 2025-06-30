// src/components/auth/__tests__/Login.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../Login'

test('handles login form submission', async () => {
  const user = userEvent.setup()
  renderWithProviders(<Login />)
  
  // Fill form
  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.type(screen.getByLabelText(/password/i), 'password123')
  
  // Submit
  await user.click(screen.getByRole('button', { name: /sign in/i }))
  
  // Check for loading state or success
  expect(screen.getByText(/signing in/i)).toBeInTheDocument()
})
