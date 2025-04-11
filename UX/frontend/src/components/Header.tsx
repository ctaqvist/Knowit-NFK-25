import { AppBar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Header() {
  return (

    <AppBar position="fixed" sx={{
      justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 2, p: 1, bgcolor: 'transparent',
      boxShadow: 'none', filter: 'drop-shadow(0px 11px 10px black)',
      '& a': { color: 'text.primary', textDecoration: 'none' },
      '& a:not(#logo)::after': { content: '""', width: '0%', backgroundColor: '#FFF', height: '1px', display: 'block', transition: 'width 100ms' },
      '& a:not(#logo):hover::after': { width: '100%' }
    }}>
      <Link to={'/support'}>
        <Typography variant="headerlink" component="div">
          Tech Support
        </Typography>
      </Link>
      <Link to={'/product'}>
        <Typography variant="headerlink" component="div">
          About
        </Typography>
      </Link>
      <Link to='/' id='logo'>
        <img src="/logo_full.svg" alt="Home"
          style={{ width: '120px' }} />
      </Link>
      <Link to={'/#reviews'}>
        <Typography variant="headerlink" component="div">
          Reviews
        </Typography>
      </Link>
      <Link to={'/contact'}>
        <Typography variant="headerlink" component="div">
          Contact
        </Typography>
      </Link>
    </AppBar>
  )
}

export default Header;