import React from 'react';
import { NavLink } from 'react-router-dom';
import accountIcon from '../images/account.svg';

export default function Header() {
  return (
    <header>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/rules">Rules</NavLink>
      </nav>
      <span>
        Cheddit
      </span>
      <span className="account">
        Anon
        <img src={accountIcon} alt="" />
      </span>
    </header>
  );
}
