import Blogs from '@routes/Blogs';
import Login from '@routes/Login';
import Signup from '@routes/Signup';
import Splat from '@routes/Splat';

const routes = [
  { path: '/blogs', element: <Blogs /> },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },
  { path: '*', element: <Splat /> },
];

export default routes;
