import { useState } from 'react';
import styles from './Signup.module.css';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  console.log(email);
  return (
    <div className={styles.signupForm}>
      <h1>Sign Up</h1>
      <input
        type='email'
        placeholder='email'
        name='email'
        aria-label='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='text'
        placeholder='username'
        name='username'
        aria-label='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type='password'
        placeholder='password'
        name='password'
        aria-label='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type='password'
        placeholder='confirm password'
        name='confirm-password'
        aria-label='Confirm Password'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <span>
        Already have an account? <Link to={'/login'}>Log In.</Link>
      </span>
    </div>
  );
};

export default Signup;
