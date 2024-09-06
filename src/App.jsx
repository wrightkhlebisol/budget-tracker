import React from 'react'
import NotificationList from './components/NotificationList'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white">
        <NotificationList />
      </div>
    </ThemeProvider>
  )
}

export default App
