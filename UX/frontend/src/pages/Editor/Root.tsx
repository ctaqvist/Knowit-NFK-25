import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

// This is the root of editor
function Root() {

  return (
    <Box sx={{
      px: 2,
      backgroundImage: 'url("https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images//ivana-cajina-asuyh-_ZX54-unsplash%20(1)%201-3%202.png")',
      backgroundRepeat: 'no-repeat', backgroundSize: 'cover', minHeight: 1920
    }}>
      <Box maxWidth={1280}
        sx={{ pt: '94.89px', mx: 'auto', }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default Root;