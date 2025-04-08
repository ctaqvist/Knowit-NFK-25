import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Box } from '@mui/material';

function Root() {
  return (
    <Box
      bgcolor='primary.background'
      sx={{ height: '100vh', m: 0 }}>
      <Header />
      <Outlet />
    </Box>
  )
}

export default Root;