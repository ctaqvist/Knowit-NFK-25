import { Outlet } from 'react-router-dom';
import Header from './Header';

function Root() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Root;