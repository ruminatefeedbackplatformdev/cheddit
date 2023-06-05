import React, { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  updateProfile,
} from 'firebase/auth';
import googleLogo from '../images/google-logo.png';

export default function SignUp({ creatingAccount, setCreatingAccount }) {
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [error, setError] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [validConfirm, setValidConfirm] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validName, setValidName] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  useEffect(() => {
    if (newEmail === '') {
      setError('enter email');
    }
    if (newEmail !== '' && !validEmail) {
      setError('invalid email');
    }
    if (validEmail && newName === '') {
      setError('enter name');
    }
    if (validEmail && newName !== '' && !validName) {
      setError('invalid name (1-20 characters)');
    }
    if (validEmail && validName && newPassword === '') {
      setError('enter password');
    }
    if (validEmail && validName && newPassword !== '' && !validPassword) {
      setError('check password requirements');
    }
    if (
      validEmail
      && validName
      && validPassword
      && (!validConfirm || newPassword !== confirmedPassword)
    ) {
      setError('passwords do not match');
    }
    if (
      validEmail
      && validName
      && validPassword
      && validConfirm
      && newPassword === confirmedPassword
    ) {
      setError(null);
    }
  }, [confirmedPassword, newEmail, newName, newPassword]);

  const changeConfirmed = (event) => {
    setConfirmedPassword(event.target.value);
    setValidConfirm(event.target.validity.valid);
  };

  const changeEmail = (event) => {
    setNewEmail(event.target.value);
    setValidEmail(event.target.validity.valid);
  };

  const changeName = (event) => {
    setNewName(event.target.value);
    setValidName(event.target.validity.valid);
  };

  const changePassword = (event) => {
    setNewPassword(event.target.value);
    setValidPassword(event.target.validity.valid);
  };

  const convertToRegex = (string) => {
    // for validating password confirmation input field
    const newString = [];
    const letters = 'abcdefghijklmnopqrstuvwyz';
    const numbers = '1234567890';
    const symbols = '^$.*+?()[]{}|/\\';
    for (let i = 0; i < string.length; i += 1) {
      const char = string[i];
      if (
        !letters.includes(char)
        && !letters.includes(char.toLowerCase())
        && !numbers.includes(char)
        && symbols.includes(char)
      ) {
        // need to escape the correct symbols for regex
        newString.push(`\\${char}`);
      } else {
        newString.push(char);
      }
    }
    return newString.join('');
  };

  const createAccount = async () => {
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, newEmail, newPassword);
      updateProfile(auth.currentUser, {
        displayName: newName,
      });
    } catch (err) {
      const { code } = { ...err };
      switch (code) {
        case 'auth/email-already-in-use':
          setError('email already in use');
          break;
        case 'auth/invalid-email':
          setError('invalid email');
          break;
        case 'auth/weak-password':
          setError('weak password');
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

  const passwordRegex = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9]).{8,}$';

  const toggleCreate = () => {
    setConfirmedPassword('');
    setCreatingAccount(!creatingAccount);
    setNewEmail('');
    setNewName('');
    setNewPassword('');
  };

  return (
    <div className="login">
      <div>
        <h1>Create Account</h1>
        <form>
          <label htmlFor="email-create">
            email:
            <input
              id="email-create"
              onChange={changeEmail}
              required
              type="email"
              value={newEmail || ''}
            />
          </label>
          <label htmlFor="name-create">
            name:
            <input
              id="name-create"
              maxLength={20}
              minLength={1}
              onChange={changeName}
              required
              type="text"
              value={newName || ''}
            />
          </label>
          <label htmlFor="password-create">
            password:
            <input
              id="password-create"
              minLength={8}
              onChange={changePassword}
              pattern={passwordRegex}
              required
              type="password"
              value={newPassword || ''}
            />
            <span className={validPassword ? 'valid' : 'error'}>
              requirements
            </span>
            <ul aria-label="password requirements">
              <li className={newPassword.length >= 8 ? 'valid' : 'error'}>
                8 characters minimum length
              </li>
              <li className={newPassword.match(/[A-Z]/) ? 'valid' : 'error'}>
                1 uppercase letter
              </li>
              <li className={newPassword.match(/[a-z]/) ? 'valid' : 'error'}>
                1 lowercase letter
              </li>
              <li className={newPassword.match(/[0-9]/) ? 'valid' : 'error'}>
                1 number
              </li>
              <li
                className={
                  newPassword.match(/[^a-zA-Z0-9]/) ? 'valid' : 'error'
                }
              >
                1 symbol (~!@#$%^&* etc)
              </li>
            </ul>
          </label>
          <label htmlFor="password-confirm">
            confirm password:
            <input
              id="password-confirm"
              onChange={changeConfirmed}
              pattern={convertToRegex(newPassword)}
              required
              type="password"
              value={confirmedPassword || ''}
            />
          </label>
          <div className="login-buttons">
            <button
              disabled={
                error
                || !validConfirm
                || !validEmail
                || !validPassword
                || !validName
              }
              type="button"
              onClick={createAccount}
            >
              Register
            </button>
            <button onClick={toggleCreate} type="button">
              Return to login
            </button>
          </div>
          <span className={error ? 'error' : 'error hidden'}>
            {error || 'error'}
          </span>
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
