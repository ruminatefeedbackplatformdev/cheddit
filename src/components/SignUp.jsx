import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  updateProfile,
} from 'firebase/auth';

export default function SignUp({ creatingAccount, setCreatingAccount }) {
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [error, setError] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const changeConfirmed = (event) => {
    setConfirmedPassword(event.target.value);
  };

  const changeEmail = (event) => {
    setNewEmail(event.target.value);
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
      await createUserWithEmailAndPassword(auth, newEmail, newPassword);
      updateProfile(auth.currentUser, {
        displayName: newName,
      });
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
    setConfirmedPassword('');
    setCreatingAccount(!creatingAccount);
    setNewEmail('');
    setNewName('');
    setNewPassword('');
  };

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
              required
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
          <button disabled={error} type="button" onClick={createAccount}>
            Register
          </button>
          {error ? <span className="error">{error}</span> : null}
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
      </div>
    </div>
  );
}
