import React from 'react';
import { NavLink } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import anonIcon from '../images/account.svg';
import hourglass from '../images/loading.gif';

export default function Header({ setUser, user }) {
  const determineUserImage = () => {
    if (user === 'loading') {
      return null;
    }
    if (user && user.photoURL) {
      return user.photoURL;
    }
    return anonIcon;
  };

  const logout = () => {
    const auth = getAuth();
    setUser(null);
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
        <span className="header-loading">
          {user ? (
            <span>{user === 'loading' ? user : user.displayName}</span>
          ) : (
            'Anonymous'
          )}
          {user === 'loading' ? <img src={hourglass} alt="" /> : null }
        </span>
        <img
          referrerPolicy="no-referrer"
          src={determineUserImage()}
          alt=""
        />
      </span>
    </header>
  );
}
