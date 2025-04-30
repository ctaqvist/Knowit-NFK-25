import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

// This is the root of editor
function Root() {

  return (
    <Box sx={{ pt: '94.89px' }}>
      <Outlet />
    </Box>
  )
}

export default Root;