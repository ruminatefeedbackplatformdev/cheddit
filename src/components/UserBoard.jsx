import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import deleteIcon from '../images/delete.svg';

export default function UserBoard({ board, deleteBoard, loading }) {
  const [confirming, setConfirming] = useState(false);

  const toggleConfirm = () => {
    setConfirming(!confirming);
  };

  return (
    <div className="user-board">
      <span>
        <Link to={`/${board.id}`}>{`/${board.id}/ - ${board.name}`}</Link>
        {!loading ? (
          <input
            aria-label="delete board"
            className={confirming ? 'delete-icon hidden' : 'delete-icon'}
            onClick={toggleConfirm}
            src={deleteIcon}
            type="image"
          />
        ) : null}
      </span>
      {!loading ? (
        <div className={confirming ? 'confirm' : 'confirm hidden'}>
          <div className="error">
            You sure? Posts will be gone forever!
          </div>
          <div className="confirm-buttons">
            <button
              className="confirm-delete"
              data-board={board.id}
              hidden={!confirming}
              onClick={deleteBoard}
              type="button"
            >
              {`Delete /${board.id}/`}
            </button>
            <button hidden={!confirming} onClick={toggleConfirm} type="button">
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
