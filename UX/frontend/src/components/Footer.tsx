import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Footer() {
  return (

    <Box
      component='footer'
      sx={{
        width: '100%', minHeight: 200, p: 2, pb: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
        '& a': { color: 'text.primary', textDecoration: 'none', fontSize: '0.8rem' },
        '& a:hover': { textDecoration: 'underline', textUnderlineOffset: '2px' },
        '& .footerColumn': { flexDirection: 'column', display: 'flex', width: 'fit-content', gap: 0.2 }
      }}>
      <Box sx={{ flex: '100%', textAlign: 'center' }}>
        <img src='/logo_full.svg' alt='Logo' style={{ width: '70px', justifySelf: 'center' }} />
        <Typography variant='h6'
          sx={{ fontWeight: 200, fontSize: '0.8rem', mt: 0.5 }}>Seamless Pickup, Beyond Planets</Typography>
      </Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', p: 4, width: '100%', gap: 8 }}>
        <Box className='footerColumn'>
          <Typography variant='footerlabel'>About TerraX9</Typography>
          <Link to='/support'>Reviews</Link>
          <Link to='/product'>About</Link>
          <Link to='/contact'>Book a consultation</Link>
        </Box>

        <Box className='footerColumn'>
          <Typography variant='footerlabel'>Help and support</Typography>
          <Link to='/support'>Customer Support</Link>
          <Link to='/support#manual'>User Guide</Link>
        </Box>

        <Box className='footerColumn'>
          <Typography variant='footerlabel'>Legal</Typography>
          <Link to='/support'>Terms & Conditions</Link>
          <Link to='/product'>Privacy</Link>
        </Box>
      </Box>
      <Typography
        sx={{ flex: '100%', textAlign: 'center', fontSize: '0.8rem' }}
      >&copy; 2025 TerraX9, All rights reserved</Typography>
    </Box>
  )
}

export default Footer;