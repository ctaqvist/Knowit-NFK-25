import { RouterProvider } from 'react-router-dom'
import { router } from './router/router'
import { AuthProvider } from './context/AuthProvider'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from './theme/ThemeProvider'
import { ContentProvider } from './context/ContentProvider'
import './index.css'
function App() {

  return (
    <ContentProvider>
      <ThemeProvider>
        <CssBaseline />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </ContentProvider>
  )
}

export default App
