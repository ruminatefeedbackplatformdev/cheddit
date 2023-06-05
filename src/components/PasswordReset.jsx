import React, { useEffect, useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default function PasswordReset({ togglePasswordReset }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validEmail, setValidEmail] = useState(false);

  useEffect(() => {
    if (email === '') {
      setError('enter email');
    }
    if (email !== '' && !validEmail) {
      setError('invalid email');
    }
    if (email !== '' && validEmail) {
      setError(null);
      setSuccess(null);
    }
  }, [email]);

  const changeEmail = (event) => {
    setEmail(event.target.value);
    setValidEmail(event.target.validity.valid);
  };

  const sendResetEmail = async () => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setError(null);
      setSuccess('password reset email sent');
    } catch (err) {
      console.error(err);
      setSuccess(null);
      switch ({ ...err }.code) {
        case 'auth/user-not-found':
          setError('user not found');
          break;
        case 'auth/invalid-email':
          setError('invalid email');
          break;
        case 'auth/too-many-requests':
          setError('too many attempts - try later');
          break;
        default:
          setError(`server error: ${{ ...err }.code}`);
          break;
      }
    }
  };

  const toggleMessage = () => {
    if (error && !success) {
      return 'error';
    }
    if (!error && success) {
      return 'valid';
    }
    return 'error hidden';
  };

  return (
    <div className="login">
      <div>
        <h1>Reset password</h1>
        <form>
          <span>Enter your email to request a password reset link</span>
          <label htmlFor="forgot-email">
            email:
            <input
              id="forgot-email"
              onChange={changeEmail}
              required
              type="email"
              value={email || ''}
            />
          </label>
          <span className={toggleMessage()}>{error || success || 'error'}</span>
          <button
            disabled={error || !validEmail}
            onClick={sendResetEmail}
            type="button"
          >
            Reset password
          </button>
          <button onClick={togglePasswordReset} type="button">
            Back to login
          </button>
        </form>
      </div>
    </div>
  );
}
