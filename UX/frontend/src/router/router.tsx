import { createBrowserRouter } from 'react-router-dom';
import Hero from '../pages/Hero';
import Bookings from '../pages/Bookings';
import Product from '../pages/Product';
import Contact from '../pages/Contact';
import Login from '../pages/Editor/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Hero />
  },
  {
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
    element: <Login />
  }
])