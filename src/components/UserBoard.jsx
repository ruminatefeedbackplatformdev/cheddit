import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserBoard({ board, deleteBoard }) {
  const [confirming, setConfirming] = useState(false);

  const toggleConfirm = () => {
    setConfirming(!confirming);
  };

  return (
    <span>
      <Link to={`/${board.id}`}>{`/${board.id}/ - ${board.name}`}</Link>
      <button hidden={confirming} onClick={toggleConfirm} type="button">
        Delete Board
      </button>
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
    </span>
  );
}
