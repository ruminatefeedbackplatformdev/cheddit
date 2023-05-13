import React from 'react';
import { Link } from 'react-router-dom';

export default function Home({ boards }) {
  return (
    <div className="home">
      <div className="site-info">
        <p>
          Cheddit is yet another imageboard site, where you can create and
          moderate your very own discusson boards. Anyone can participate
          anonymously, but only authenticed users can create boards. Check out
          the communities below and join in!
        </p>
        <p>
          Be sure to familiarize yourself with the
          {' '}
          <Link to="/rules">rules</Link>
          {' '}
          before posting.
        </p>
      </div>
      <div className="boards">
        {boards.length ? (
          boards.map((board) => (
            <Link key={board.id} to={`/${board.id}`}>
              {`/${board.id}/ - ${board.name}`}
            </Link>
          ))
        ) : (
          <span>Loading boards...</span>
        )}
      </div>
    </div>
  );
}
