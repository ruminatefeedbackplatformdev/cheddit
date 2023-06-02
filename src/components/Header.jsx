import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import anonIcon from '../images/account.svg';
import hourglass from '../images/loading.gif';
import cheese from '../images/cheese.png';

export default function Header({ setUser, user }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const blur = (event) => {
    event.target.blur();
  };

  const determineUserImage = () => {
    if (user && !user.photoURL) {
      return anonIcon;
    }
    if (user && user.photoURL) {
      return user.photoURL;
    }
    return null;
  };

  const hideMenu = () => {
    setMenuVisible(false);
  };

  const logout = () => {
    const auth = getAuth();
    setUser(null);
    signOut(auth);
    hideMenu();
  };

  const showMenu = () => {
    if (user && user !== 'loading') {
      setMenuVisible(true);
    }
  };

  return (
    <header>
      <nav>
        <Link onClick={blur} to="/">
          <img alt="" src={cheese} />
          Cheddit
        </Link>
      </nav>
      <span
        className="account"
        onBlur={hideMenu}
        onClick={showMenu}
        onFocus={showMenu}
        onKeyPress={showMenu}
        onMouseOut={hideMenu}
        onMouseOver={showMenu}
        role="button"
        tabIndex="0"
      >
        <span className="header-loading">
          {user ? (
            <span>
              {user === 'loading' ? (
                user
              ) : (
                <Link onClick={blur} to="/dash/">{user.displayName}</Link>
              )}
            </span>
          ) : (
            <Link className="login" onClick={blur} to="/dash">
              Log In
            </Link>
          )}
          {user === 'loading' ? <img src={hourglass} alt="" /> : null}
        </span>
        {user && user !== 'loading' ? (
          <img referrerPolicy="no-referrer" src={determineUserImage()} alt="" />
        ) : null}
        {user && user !== 'loading' ? '▼' : null}
        <div
          className={
            menuVisible && user && user !== 'loading' ? 'menu' : 'menu hidden'
          }
          onBlur={hideMenu}
          onMouseOut={hideMenu}
        >
          {user && user !== 'loading' ? (
            <span>
              <ul>
                <li>
                  <Link onClick={blur} to="/dash">Dashboard</Link>
                </li>
                <li>
                  <button onClick={logout} type="button">
                    Sign Out
                  </button>
                </li>
              </ul>
            </span>
          ) : null}
        </div>
      </span>
    </header>
  );
}
