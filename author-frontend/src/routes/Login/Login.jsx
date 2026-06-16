import { useState, useEffect } from 'react';
import styles from '../auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '@components/Toast';
import { isLoggedIn } from '@utils/auth.js';

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorObjects, setErrorObjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Login';
  }, []);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/blogs', { viewTransition: true });
    }
  });

  /**
   * statuses
   * 201: successful signup
   * 400: field errors
   * 409: username or email in use
   */
  const formSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setFieldErrors({});
      setErrorObjects([]);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
      } else if (response.status === 401) {
        const data = await response.json();
        const errorObj = [
          {
            id: crypto.randomUUID(),
            error: 'Incorrect username or password.',
          },
        ];

        setFieldErrors(data.fieldErrors);
        setErrorObjects(errorObj);
      } else {
        // 500 error
      }
    } catch (error) {
      console.error(error);
      // set server error fetch failed. couldn't connect to api etc.
    } finally {
      setLoading(false);
    }
  };

  const removeErrorObject = (id) => {
    console.log(id);
    const errors = [...errorObjects];
    const filtered = errors.filter((obj) => obj.id !== id);
    setErrorObjects(filtered);
  };

  return (
    <div className={styles.container}>
      <div className={styles.toasts}>
        {errorObjects &&
          errorObjects.map((errorObj) => {
            return (
              <Toast
                key={errorObj.id}
                color={'#7f1d1d'}
                removeToast={() => removeErrorObject(errorObj.id)}
              >
                {errorObj.error}
              </Toast>
            );
          })}
      </div>

      <form className={styles.signupForm} onSubmit={(e) => formSubmit(e)}>
        <h1>Log In</h1>
        <input
          type='text'
          placeholder='username or email'
          name='username'
          aria-label='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={`${styles.input} ${fieldErrors?.username ? styles.error : ''}`}
        />
        <input
          type='password'
          placeholder='password'
          name='password'
          aria-label='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`${styles.input} ${fieldErrors?.password ? styles.error : ''}`}
        />
        <button type='submit' disabled={loading} className={styles.button}>
          Log In
        </button>
        <span>
          Need an account?{' '}
          <Link to={'/signup'} viewTransition>
            Sign Up.
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
