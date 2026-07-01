import { useState, useEffect } from 'react';
import styles from '../auth.module.css';
import { Link, useNavigate } from 'react-router';
import Toast from '@components/Toast';
import { getUsername, isLoggedIn, setUserFields } from '@utils/auth.js';
import { useAuth } from '@contexts/AuthContext.jsx';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(getUsername());
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorObjects, setErrorObjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const { refreshAuth } = useAuth();

  useEffect(() => {
    document.title = 'Sign up';
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
        `${import.meta.env.VITE_API_URL}/api/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            username,
            password,
            confirmPassword,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setUserFields(data);
        refreshAuth();
      } else if (response.status === 400 || response.status === 409) {
        const data = await response.json();
        const errorObj = Object.values(data.fieldErrors).map((error) => {
          const id = crypto.randomUUID();
          return {
            id,
            error,
          };
        });
        setFieldErrors(data.fieldErrors);
        setErrorObjects(errorObj);
      } else {
        // 500 error
        throw new Error('Issues creating the username. Try again.');
      }
    } catch (error) {
      console.error(error);
      // set server error fetch failed. couldn't connect to api etc.
    } finally {
      setLoading(false);
    }
  };

  const removeErrorObject = (id) => {
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
        <h1>Sign Up</h1>
        <input
          type='email'
          placeholder='email'
          name='email'
          aria-label='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`${styles.input} ${fieldErrors?.email ? styles.error : ''}`}
        />
        <input
          type='text'
          placeholder='username'
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
        <input
          type='password'
          placeholder='confirm password'
          name='confirmPassword'
          aria-label='Confirm Password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={`${styles.input} ${fieldErrors?.confirmPassword ? styles.error : ''}`}
        />
        <button type='submit' disabled={loading} className={styles.button}>
          Sign Up
        </button>
        <span>
          Already have an account?{' '}
          <Link to={'/login'} viewTransition>
            Log In.
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
