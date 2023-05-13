import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NewBoard from './NewBoard';

export default function UserBoards({ boards, setUser, user }) {
  const [enabled, setEnabled] = useState(false);

  const enableForm = () => {
    setEnabled(!enabled);
  };

  return (
    <div className="user-boards">
      <h2>Your Boards</h2>
      {user.boards.map((board) => (
        <Link key={`ub-${board.id}`} to={`/${board.id}`}>
          {`/${board.id}/ - ${board.name}`}
        </Link>
      ))}
      <button
        className={enabled ? 'button hidden' : 'button visible'}
        onClick={enableForm}
        type="button"
      >
        ADD NEW BOARD
      </button>
      <NewBoard
        boards={boards}
        enabled={enabled}
        enableForm={enableForm}
        setUser={setUser}
        user={user}
      />
    </div>
  );
}
