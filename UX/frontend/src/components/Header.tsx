import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to='/product'>Manual</Link>
          </li>
          <li>
            <Link to='/product'>About</Link>
          </li>
          <li>
            <Link to='/'>
              <img src="/logo_full.svg" alt="" width={120} />
            </Link>
          </li>
          <li>
            <Link to='/#reviews'>Reviews</Link>
          </li>
          <li>
            <Link to='/contact'>Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
