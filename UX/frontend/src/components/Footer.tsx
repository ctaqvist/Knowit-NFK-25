import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <Box
      component='footer'
      sx={{ // Footer container styling
        width: '100%',
        minHeight: 371,
        display: 'flex',
        flexDirection: 'column',
        pt: '74px',
        background:
          'linear-gradient(180deg, rgba(24, 7, 87, 0.40) 0%, rgba(24, 7, 87, 0.00) 100%)',
        '& a': { // General Footer link styling
          color: 'text.primary',
          textDecoration: 'none',
          transition: 'text-shadow 200ms',
        }, // Link hover state
        '& a:hover': {
          textDecoration: 'underline',
          textUnderlineOffset: '2px',
          textShadow: '0px 9px 8px #5526FF',
        }, // Styling of each category column
        '& .footerColumn': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'end',
          width: 'clamp(100px, 170px, 180px)',
          textAlign: 'start',
        },
        '& .footerColumn.right': { alignItems: 'end', textAlign: 'end' }, // Legal and Contact columns
        '& .MuiTypography-footerlabel': { pb: '20px' }, // Label of each footer category
        '& a, p :not(.copyright) ': { fontSize: 16, minWidth: 'max-content' }, // All p/a elements
      }}
    >
      {/* Left side: Menu */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'space-evenly', md: 'space-between' },
          width: 'clamp(200px, 90vw, 1280px)',
          margin: '0 auto',
          minHeight: 185,
          gap: 'clamp(10px, 20px, 40px)',
          flexWrap: { xs: 'wrap', lg: 'nowrap' },
          p: { md: '0 0 2rem', lg: 0 },
        }}
      >
        <Box
          sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}
        >
          <Box className='footerColumn'>
            <Typography
              variant='footerlabel'
              sx={{ width: '100%' }}
            >
              Menu
            </Typography>
            <Link to='/support'>Support</Link>
            <Link to='/product'>About product</Link>
          </Box>
          <Box className='footerColumn'>
            <Link to='/#reviews'>Reviews</Link>
            <Link to='/contact'>Contact to buy</Link>
          </Box>
        </Box>

        {/* Logo section */}
        <Box
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '26px',
            alignItems: 'center',
            height: 'fit-content',
            flexShrink: 0,
            order: { xs: -1, lg: 0 },
            flex: { xs: '100%', lg: 1 },
            p: { xs: '0 0 1rem', md: 0 },
          }}
        >
          <Typography
            variant='body1'
            sx={{
              fontWeight: 400,
              fontSize: 16,
              fontFamily: 'Lexend Exa, sans-serif',
            }}
          >
            Seamless Pickup, Beyond Planets
          </Typography>
          <img
            src='/logo_full.svg'
            alt='Logo'
            style={{ width: 153.816, justifySelf: 'center', height: 66.18 }}
          />
        </Box>

        {/* Right side: Legal, Contact */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'end' },
            gap: { xs: '20px', md: 0 },
          }}
        >
          <Box className='footerColumn right'>
            <Typography variant='footerlabel'>Legal</Typography>
            <Link to='/product'>Cookie Policy</Link>
            <Link to='/support'>Terms & Conditions</Link>
          </Box>

          <Box
            className='footerColumn right'
            sx={{ '& p': { fontSize: 16, letterSpacing: 1.92 } }}
          >
            <Typography variant='footerlabel'>Contact</Typography>
            <Typography variant='body1'>076 893 89 36</Typography>
            <Typography variant='body1'>info@terrax9.se</Typography>
          </Box>
        </Box>
      </Box>
      <Typography
        className='copyright'
        sx={{ margin: '0 auto', fontSize: 14 }}
      >
        &copy; 2025 TerraX9, All rights reserved
      </Typography>
    </Box>
  );
}

export default Footer;
