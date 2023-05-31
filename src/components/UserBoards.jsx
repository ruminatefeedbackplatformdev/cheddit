import React, { useEffect, useState } from 'react';
import {
  deleteDoc,
  doc,
} from 'firebase/firestore';
import {
  deleteObject, getStorage, listAll, ref,
} from 'firebase/storage';
import database from '../util/firestore';
import UserBoard from './UserBoard';
import NewBoard from './NewBoard';

export default function UserBoards({ boards, setUser, user }) {
  const [enabled, setEnabled] = useState(false);
  const [userBoards, setUserBoards] = useState([]);

  useEffect(() => {
    setUserBoards(user.boards);
  }, [boards]);

  const enableForm = () => {
    setEnabled(!enabled);
  };

  const deleteBoard = async (event) => {
    // remove the board from firestore
    const { board } = event.target.dataset;
    await deleteDoc(doc(database, 'boards', board));

    // then remove the files from storage
    const storage = getStorage();
    const boardRef = ref(storage, board);
    const boardImages = await listAll(boardRef);
    boardImages.items.forEach(async (image) => {
      await deleteObject(image);
    });

    // remove board from local state
    const userBoardsCopy = [...userBoards];
    userBoardsCopy.forEach((userBoard) => {
      if (userBoard.id === board) {
        const index = userBoardsCopy.indexOf(board);
        userBoardsCopy.splice(index, 1);
      }
    });
    setUserBoards(userBoardsCopy);
    setUser({
      ...user,
      boards: userBoardsCopy,
    });
  };

  return (
    <div className="user-boards">
      <h2>Your Boards</h2>
      {userBoards.map((board) => (
        <UserBoard
          board={board}
          deleteBoard={deleteBoard}
          key={`ub-${board.id}`}
        />
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
