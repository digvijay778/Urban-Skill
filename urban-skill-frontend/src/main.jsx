import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Import global styles
import '@styles/globals.css'

// Performance monitoring (optional - for production)
const enablePerformanceMonitoring = () => {
  if (import.meta.env.PROD && 'performance' in window) {
    // Log performance metrics
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0]
      console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms')
      console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms')
    })
  }
}

// Service Worker registration (for PWA features)
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered successfully:', registration)
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
}

// Initialize app
const initializeApp = () => {
  // Enable performance monitoring
  enablePerformanceMonitoring()
  
  // Register service worker
  registerServiceWorker()
  
  // Create root and render app
  const root = ReactDOM.createRoot(document.getElementById('root'))
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

// Initialize the application
initializeApp()

// Hot Module Replacement (HMR) for development
if (import.meta.hot) {
  import.meta.hot.accept()
}

// Global error handling for development
if (import.meta.env.DEV) {
  window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error)
  })
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason)
  })
}
