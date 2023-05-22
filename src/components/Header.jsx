import React from 'react';
import { NavLink } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import anonIcon from '../images/account.svg';

export default function Header({ user }) {
  const logout = () => {
    const auth = getAuth();
    signOut(auth);
  };

  return (
    <header>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/dash">Dashboard</NavLink>
      </nav>
      <span>Cheddit</span>
      <span className="account">
        {user && user !== 'loading' ? (
          <span>
            <button onClick={logout} type="button">
              Sign Out
            </button>
          </span>
        ) : null}
        <span>
          {user ? (
            <span>{user === 'loading' ? user : user.displayName}</span>
          ) : (
            'Anonymous'
          )}
        </span>
        <img
          referrerPolicy="no-referrer"
          src={user ? user.photoURL : anonIcon}
          alt=""
        />
      </span>
    </header>
  );
}
