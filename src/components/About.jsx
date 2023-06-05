import React from 'react';
import accountIcon from '../images/account.svg';
import cheese from '../images/cheese.png';
import deleteIcon from '../images/delete.svg';
import googleLogo from '../images/google-logo.png';
import hourglass from '../images/loading.gif';
import sticky from '../images/sticky.png';

export default function About() {
  return (
    <div className="about-container">
      <h1>About Cheddit</h1>
      <div className="about-cheddit">
        <div>
          Cheddit was designed by
          {' '}
          <a
            target="_blank"
            href="http://www.seanericthomas.com"
            rel="noreferrer"
          >
            Sean Eric Thomas
          </a>
          {' ('}
          <a
            target="_blank"
            href="https://github.com/MongrelArchitect/cheddit"
            rel="noreferrer"
          >
            Github
          </a>
          {') '}
          while following
          {' '}
          <a
            target="_blank"
            href="https://www.theodinproject.com/lessons/node-path-javascript-javascript-final-project"
            rel="noreferrer"
          >
            The Odin Project
          </a>
          .
        </div>
        <div>
          {' '}
          Technologies utilized include
          {' '}
          <a target="_blank" href="https://react.dev/" rel="noreferrer">
            React
          </a>
          {' '}
          for the front end UI, with
          {' '}
          <a
            target="_blank"
            href="https://firebase.google.com/"
            rel="noreferrer"
          >
            Firebase
          </a>
          {' '}
          for the back end functionality.
        </div>
      </div>
      <h1>Attributions</h1>
      <div className="about-cheddit">
        <ul>
          <li>
            <img alt="" src={accountIcon} />
            Account icon from
            {' '}
            <a
              target="_blank"
              href="https://pictogrammers.com/library/mdi/icon/account/"
              rel="noreferrer"
            >
              Pictogrammers
            </a>
          </li>
          <li>
            <img alt="" src={cheese} />
            Cheese icon created by
            {' '}
            <a
              target="_blank"
              href="https://www.flaticon.com/free-icon/cheese_4063297"
              rel="noreferrer"
            >
              Good Ware - Flaticon
            </a>
          </li>
          <li>
            <img alt="" src={deleteIcon} />
            Delete icon from
            {' '}
            <a
              target="_blank"
              href="https://pictogrammers.com/library/mdi/icon/delete-forever/"
              rel="noreferrer"
            >
              Pictogrammers
            </a>
          </li>
          <li>
            <img alt="" src={googleLogo} />
            Google logo icon by
            {' '}
            <a
              target="_blank"
              href="https://about.google/brand-resource-center/logos-list/"
              rel="noreferrer"
            >
              Google
            </a>
          </li>
          <li>
            <img alt="" src={hourglass} />
            Hourglass gif from
            {' '}
            <a
              target="_blank"
              href="https://gifer.com/en/XVo6"
              rel="noreferrer"
            >
              Gifer
            </a>
          </li>
          <li>
            <img alt="" src={sticky} />
            Sticky icon created by
            {' '}
            <a
              target="_blank"
              href="https://www.flaticon.com/free-icon/sticky-notes_4147058"
              rel="noreferrer"
            >
              mpanicon - Flaticon
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
