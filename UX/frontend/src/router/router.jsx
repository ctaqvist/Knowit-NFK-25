import { createBrowserRouter } from 'react-router-dom';
import Hero from '../pages/Hero';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Hero />,
  },
]);
