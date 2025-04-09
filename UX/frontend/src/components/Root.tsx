import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Box } from '@mui/material';
import Footer from './Footer';

function Root() {
  return (
    <Box
      bgcolor='primary.background'
      sx={{ m: 0 }}>
      <Header />
      <main
        style={{ minHeight: 'calc(100vh - 74.88px - 200px)' }}>
        <Outlet />
      </main>
      <Footer />
    </Box>
  )
}

export default Root;