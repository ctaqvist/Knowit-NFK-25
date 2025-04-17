import { AppBar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Header() {
  return (

    <AppBar position="fixed">
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
      <Link to='/' id='logo' style={{ flexShrink: 0 }}>
        <img src="/logo_full.svg" alt="Home"
          style={{ width: 'fit-content', height: 60.891 }} />
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