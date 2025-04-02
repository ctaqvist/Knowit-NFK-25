import { createBrowserRouter } from 'react-router-dom';
import Hero from '../pages/Hero';
import Bookings from '../pages/Bookings';
import Product from '../pages/Product';
import Contact from '../pages/Contact';

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
  }
])