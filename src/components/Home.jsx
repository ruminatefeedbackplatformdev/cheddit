import React from 'react';
import { Link } from 'react-router-dom';

export default function Home({ boards }) {
  return (
    <div className="home">
      <div className="site-info">
        <p>
          Cheddit is yet another imageboard site, where you can create and
          moderate your very own boards. Users can participate in discussions
          anonymously, but only authenticed users can create boards. Check out
          what communities are available below and join the conversations!
        </p>
      </div>
      <div className="boards">
        {boards.length ? (
          boards.map((board) => (
            <Link
              key={board.id}
              to={`/${board.id}`}
            >
              {board.name}
            </Link>
          ))
        ) : (
          <span>Loading boards...</span>
        )}
      </div>
    </div>
  );
}
