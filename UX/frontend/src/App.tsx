import { RouterProvider } from 'react-router-dom'
import { router } from './router/router'
import { AuthProvider } from './context/AuthProvider'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from './theme/ThemeProvider'

function App() {

  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
