import { Outlet } from 'react-router-dom';
import Header from './Header';

function Root() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default Root;