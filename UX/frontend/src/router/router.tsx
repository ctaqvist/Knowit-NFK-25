import { createBrowserRouter } from 'react-router-dom';
import Hero from '../pages/Hero';
import Bookings from '../pages/Bookings';
import Product from '../pages/Product';
import Contact from '../pages/Contact';
import Login from '../pages/Editor/Login';
import Editor from '../pages/Editor/Editor';
import { AuthRedirect } from '../pages/Editor/AuthRedirect';
import Root from '../components/Root';
import EditorRoot from '../pages/Editor/Root'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [{
      path: '/',
      element: <Hero />
    }, {
      path: '/product',
      element: <Product />
    },
    {
      path: '/bookings',
      element: <Bookings />
    },
    {
      path: '/contact',
      element: <Contact />
    },
    {
      path: '/login',
      element: <>
        <AuthRedirect />
        <Login />
      </>
    },
    {
      path: '/editor',
      element: <EditorRoot />,
      children: [{
        path: '/editor',
        element: <Editor />,
      }]
    }]
  },

])