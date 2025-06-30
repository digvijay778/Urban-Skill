// src/components/auth/__tests__/Register.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import Register from '../Register'
import { AuthProvider } from '@context/AuthContext'
import theme from '@theme'

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          {component}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

describe('Register Component', () => {
  test('renders registration form', () => {
    renderWithProviders(<Register />)
    
    expect(screen.getByText(/Join Urban Skill/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
  })

  test('toggles between customer and worker role', () => {
    renderWithProviders(<Register />)
    
    const workerButton = screen.getByText(/I'm a Professional/i)
    fireEvent.click(workerButton)
    
    // Should show professional fields
    expect(screen.getByText(/Professional Details/i)).toBeInTheDocument()
  })
})
