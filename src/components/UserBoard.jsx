import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import hourglass from '../images/loading.gif';

export default function UserBoard({ board, deleteBoard, loading }) {
  const [confirming, setConfirming] = useState(false);

  const toggleConfirm = () => {
    setConfirming(!confirming);
  };

  return (
    <span className="user-board">
      <Link to={`/${board.id}`}>{`/${board.id}/ - ${board.name}`}</Link>
      <button hidden={confirming} onClick={toggleConfirm} type="button">
        Delete Board
      </button>
      {!loading ? (
        <div>
          <div className="error" hidden={!confirming}>
            Are you sure? All posts will be lost forever!
          </div>
          <button
            data-board={board.id}
            hidden={!confirming}
            onClick={deleteBoard}
            type="button"
          >
            Confirm Delete
          </button>
          <button hidden={!confirming} onClick={toggleConfirm} type="button">
            Cancel
          </button>
        </div>
      ) : (
        <div className="loading">
          Loading...
          <img alt="" src={hourglass} />
        </div>
      )}
    </span>
  );
}
