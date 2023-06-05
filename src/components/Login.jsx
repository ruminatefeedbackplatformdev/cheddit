import React, { useEffect, useState } from 'react';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from 'firebase/auth';
import SignUp from './SignUp';
import PasswordReset from './PasswordReset';
import googleLogo from '../images/google-logo.png';

export default function Login() {
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [error, setError] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  useEffect(() => {
    if (loginEmail === '') {
      setError('enter email');
    }
    if (loginEmail !== '' && !validEmail) {
      setError('invalid email');
    }
    if (validEmail && loginPassword === '') {
      setError('enter password');
    }
    if (validEmail && validPassword) {
      setError(null);
    }
  }, [loginEmail, loginPassword]);

  const changeLoginEmail = (event) => {
    setLoginEmail(event.target.value);
    setValidEmail(event.target.validity.valid);
  };

  const changeLoginPassword = (event) => {
    setLoginPassword(event.target.value);
    setValidPassword(event.target.value);
  };

  const emailLogin = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err) {
      const { code } = { ...err };
      switch (code) {
        case 'auth/invalid-email':
          setError('invalid email');
          break;
        case 'auth/missing-password':
          setError('missing password');
          break;
        case 'auth/user-not-found':
          setError('no such user');
          break;
        case 'auth/wrong-password':
          setError('wrong password');
          break;
        default:
          setError(`server error: ${code}`);
          break;
      }
    }
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);
  };

  const toggleCreate = () => {
    setCreatingAccount(!creatingAccount);
    setLoginEmail('');
    setLoginPassword('');
    setValidEmail(false);
    setValidPassword(false);
  };

  const togglePasswordReset = () => {
    setResettingPassword(!resettingPassword);
  };

  if (resettingPassword) {
    return <PasswordReset togglePasswordReset={togglePasswordReset} />;
  }

  if (creatingAccount) {
    return (
      <SignUp
        creatingAccount={creatingAccount}
        setCreatingAccount={setCreatingAccount}
      />
    );
  }

  return (
    <div className="login">
      <div>
        <h1>Sign in</h1>
        <form>
          <label htmlFor="email-login">
            email:
            <input
              id="email-login"
              onChange={changeLoginEmail}
              required
              type="email"
              value={loginEmail || ''}
            />
          </label>
          <label htmlFor="password-login">
            password:
            <input
              id="password-login"
              onChange={changeLoginPassword}
              required
              type="password"
              value={loginPassword || ''}
            />
          </label>
          <div className="login-buttons">
            <button disabled={error} type="button" onClick={emailLogin}>
              Sign in
            </button>
            <button onClick={togglePasswordReset} type="button">
              Forgot password
            </button>
          </div>
          <span
            className={
              error || !validEmail || !validPassword ? 'error' : 'error hidden'
            }
          >
            {error || 'error'}
          </span>
          <div className="create-account">
            <span>New to Cheddit:</span>
            <button onClick={toggleCreate} type="button">
              Create account
            </button>
          </div>
        </form>
      </div>
      <div>
        <h1>Or</h1>
        <div className="other-options">
          <button className="google-login" onClick={googleLogin} type="button">
            Continue with Google
            <img alt="" src={googleLogo} />
          </button>
        </div>
      </div>
    </div>
  );
}
