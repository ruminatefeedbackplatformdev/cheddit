import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteDoc, doc } from 'firebase/firestore';
import database from '../util/firestore';
import NewBoard from './NewBoard';

export default function UserBoards({ boards, setUser, user }) {
  const [enabled, setEnabled] = useState(false);
  const [userBoards, setUserBoards] = useState(boards);

  useEffect(() => {
    setUserBoards(boards);
  }, [boards]);

  const enableForm = () => {
    setEnabled(!enabled);
  };

  const deleteBoard = async (event) => {
    const { board } = event.target.dataset;
    await deleteDoc(doc(database, 'boards', board));
  };

  return (
    <div className="user-boards">
      <h2>Your Boards</h2>
      {userBoards.map((board) => (
        <span key={`ub-${board.id}`}>
          <Link to={`/${board.id}`}>{`/${board.id}/ - ${board.name}`}</Link>
          <button data-board={board.id} onClick={deleteBoard} type="button">
            Delete Board
          </button>
        </span>
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
