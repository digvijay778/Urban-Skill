// src/components/common/__tests__/Navbar.test.jsx
test('shows different menu items based on auth state', () => {
  // Test unauthenticated state
  renderWithProviders(<Navbar />)
  expect(screen.getByText(/Login/i)).toBeInTheDocument()
  expect(screen.getByText(/Sign Up/i)).toBeInTheDocument()
  
  // Test authenticated state (mock auth context)
  // ... test authenticated menu items
})
