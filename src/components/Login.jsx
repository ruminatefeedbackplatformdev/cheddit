import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect,
  updateProfile,
} from 'firebase/auth';

export default function Login() {
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [error, setError] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const changeConfirmed = (event) => {
    setConfirmedPassword(event.target.value);
  };

  const changeEmail = (event) => {
    setNewEmail(event.target.value);
  };

  const changeLoginEmail = (event) => {
    setLoginEmail(event.target.value);
  };

  const changeLoginPassword = (event) => {
    setLoginPassword(event.target.value);
  };

  const changeName = (event) => {
    setNewName(event.target.value);
  };

  const changePassword = (event) => {
    setNewPassword(event.target.value);
  };

  const createAccount = async () => {
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(
        auth,
        newEmail,
        newPassword,
      );
      updateProfile(auth.currentUser, {
        displayName: newName,
      });
    } catch (err) {
      setError(err);
    }
  };

  const emailLogin = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword,
      );
    } catch (err) {
      setError(err);
    }
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);
  };

  const toggleCreate = () => {
    setCreatingAccount(!creatingAccount);

    setError(null);

    setConfirmedPassword('');
    setNewEmail('');
    setLoginEmail('');
    setLoginPassword('');
    setNewName('');
    setNewPassword('');
  };

  if (creatingAccount) {
    return (
      <div className="login">
        <div>
          <form>
            <h2>Create Account</h2>
            <label htmlFor="email-create">
              email:
              <input
                id="email-create"
                onChange={changeEmail}
                type="email"
                value={newEmail || ''}
              />
            </label>
            <label htmlFor="name-create">
              name:
              <input
                id="name-create"
                onChange={changeName}
                type="text"
                value={newName || ''}
              />
            </label>
            <label htmlFor="password-create">
              password:
              <input
                id="password-create"
                onChange={changePassword}
                type="password"
                value={newPassword || ''}
              />
            </label>
            <label htmlFor="password-confirm">
              confirm password:
              <input
                id="password-confirm"
                onChange={changeConfirmed}
                type="password"
                value={confirmedPassword || ''}
              />
            </label>
            <button type="button" onClick={createAccount}>
              Register
            </button>
          </form>
        </div>
        <div>
          <h2>Or:</h2>
          <button type="button" onClick={googleLogin}>
            Continue with Google
          </button>
        </div>
        <div>
          <span>
            {' '}
            <button onClick={toggleCreate} type="button">
              Cancel
            </button>
          </span>
          {error ? (
            <div>
              <span>{error.message}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="login">
      <div>
        <form>
          <h2>Sign in</h2>
          <label htmlFor="email-login">
            email:
            <input
              id="email-login"
              onChange={changeLoginEmail}
              type="email"
              value={loginEmail || ''}
            />
          </label>
          <label htmlFor="password-login">
            password:
            <input
              id="password-login"
              onChange={changeLoginPassword}
              type="password"
              value={loginPassword || ''}
            />
          </label>
          <button type="button" onClick={emailLogin}>
            Sign in
          </button>
        </form>
        {error ? (
          <div>
            <span>{error.message}</span>
          </div>
        ) : null}
      </div>
      <div>
        <h2>Or:</h2>
        <button type="button" onClick={googleLogin}>
          Continue with Google
        </button>
      </div>
      <div>
        <span>
          New to Cheddit?
          {' '}
          <button onClick={toggleCreate} type="button">
            Create account.
          </button>
        </span>
      </div>
    </div>
  );
}
