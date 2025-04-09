import { AppBar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Header() {
  return (

    <AppBar position="sticky" sx={{ bgcolor: 'primary.background', justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 2, p: 1, '& a': { color: 'text.primary', textDecoration: 'none' } }}>
      <Link to={'/support'}>
        <Typography variant="headerlink" component="div" sx={{ flexGrow: 1 }}>
          Tech Support
        </Typography>
      </Link>
      <Link to={'/product'}>
        <Typography variant="headerlink" component="div" sx={{ flexGrow: 1 }}>
          About
        </Typography>
      </Link>
      <Link to='/'>
        <img src="/logo_full.svg" alt=""
          style={{ width: '120px' }} />
      </Link>
      <Link to={'/#reviews'}>
        <Typography variant="headerlink" component="div" sx={{ flexGrow: 1 }}>
          Our Clients
        </Typography>
      </Link>
      <Link to={'/contact'}>
        <Typography variant="headerlink" component="div" sx={{ flexGrow: 1 }}>
          Contact
        </Typography>
      </Link>
    </AppBar>
  )
}

export default Header;