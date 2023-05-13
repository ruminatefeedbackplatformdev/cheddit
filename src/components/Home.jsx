import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Disclaimer from './Disclaimer';

export default function Home({ boards }) {
  const [agreed, setAgreed] = useState(localStorage.getItem('disclaimer'));
  const [visible, setVisible] = useState(false);
  const [pendingRoute, setPendingRoute] = useState('#');

  const showDisclaimer = (event) => {
    if (!agreed) {
      setVisible(true);
      setPendingRoute(`/${event.target.dataset.board}`);
    }
  };

  return (
    <div className="home">
      <Disclaimer
        pendingRoute={pendingRoute}
        visible={visible}
        setAgreed={setAgreed}
        setVisible={setVisible}
      />
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
          <Link to="/rules">Rules</Link>
          {' '}
          before posting.
        </p>
      </div>
      <div className="boards">
        {boards.length ? (
          boards.map((board) => (
            <Link
              data-board={board.id}
              key={board.id}
              onClick={showDisclaimer}
              to={agreed ? `/${board.id}` : null}
            >
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
