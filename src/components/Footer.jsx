import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <span>
        <Link to="/about">About Cheddit</Link>
      </span>
      <span>
        Designed by
        {' '}
        <a
          target="_blank"
          href="http://www.seanericthomas.com"
          rel="noreferrer"
        >
          Sean Eric Thomas
        </a>
      </span>
    </footer>
  );
}
