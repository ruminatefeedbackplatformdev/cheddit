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
        {user ? (
          <span>
            <button onClick={logout} type="button">
              Sign Out
            </button>
          </span>
        ) : null}
        <span>{user ? user.displayName : 'Anonymous'}</span>
        <img src={user ? user.photoURL : anonIcon} alt="" />
      </span>
    </header>
  );
}
