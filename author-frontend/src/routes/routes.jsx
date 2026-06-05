import App from '../App.jsx';
import Login from '@routes/Login';
import Signup from '@routes/Signup';

const routes = [
  { path: '/', element: <App /> },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },
];

export default routes;
