import React, { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
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

  const deleteBoardThreadsForAllUsers = async (board) => {
    // first get all user ids
    const querySnapshot = await getDocs(collection(database, 'users'));
    const allUsers = [];
    querySnapshot.forEach((docu) => {
      allUsers.push(docu.id);
    });
    // then delete all threads from deleted board for each user
    allUsers.forEach(async (userID) => {
      const userRef = doc(database, 'users', userID);
      const userSnap = await getDoc(userRef);
      const tempUser = { ...userSnap.data() };
      const tempThreads = { ...tempUser.threads };
      delete tempThreads[board];
      tempUser.threads = tempThreads;
      setDoc(userRef, tempUser);
    });
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

    // remove all the board's threads for that user (local)
    const prevThreads = { ...user.threads };
    if (Object.keys(user.threads).includes(board)) {
      delete prevThreads[board];
    }
    setUser({
      ...user,
      threads: prevThreads,
    });

    // gotta remove it from state too
    const userBoardsCopy = [...userBoards];
    userBoardsCopy.forEach((userBoard) => {
      if (userBoard.id === board) {
        const index = userBoardsCopy.indexOf(board);
        userBoardsCopy.splice(index, 1);
      }
    });
    setUserBoards(userBoardsCopy);

    // then remove all threads for this board for all users
    await deleteBoardThreadsForAllUsers(board);
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
