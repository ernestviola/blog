import Blogs from '@routes/Blogs';
import New from '@routes/Blogs/New';
import Login from '@routes/Login';
import Signup from '@routes/Signup';
import Splat from '@routes/Splat';
import NavbarLayout from '@layouts/NavbarLayout';

const routes = [
  {
    element: <NavbarLayout />,
    path: '/blogs',
    children: [
      { index: true, Component: Blogs },
      { path: 'new', Component: New },
    ],
  },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },
  { path: '*', element: <Splat /> },
];

export default routes;
