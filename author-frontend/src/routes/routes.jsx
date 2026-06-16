import Blogs from '@routes/Blogs';
import Edit from '@routes/Blogs/Edit';
import Login from '@routes/Login';
import Signup from '@routes/Signup';
import Splat from '@routes/Splat';
import NavbarLayout from '@layouts/NavbarLayout';
import ProtectedRoute from '@components/ProtectedRoute';

const routes = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <NavbarLayout />,
        path: '/blogs',
        children: [
          { index: true, Component: Blogs },
          { path: ':blogId/edit', Component: Edit },
        ],
      },
    ],
  },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },
  { path: '*', element: <Splat /> },
];

export default routes;
