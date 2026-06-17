import Landing from '@routes/Landing';
import Blogs from '@routes/Blogs';
import Signup from '@routes/Signup';
import Login from '@routes/Login';
import Splat from '@routes/Splat';

import NavbarLayout from '@layouts/NavbarLayout';

const routes = [
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },

  {
    element: <NavbarLayout />,
    path: '/',
    children: [
      { index: true, Component: Landing },
      { path: 'blogs', Component: Blogs },
      { path: '*', Component: Splat },
    ],
  },
];

export default routes;
