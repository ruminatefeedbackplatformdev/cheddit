import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import database from '../util/firestore';

export default function NewBoard({
  boards,
  enabled,
  enableForm,
  setUser,
  user,
}) {
  const [boardID, setBoardID] = useState('');
  const [boardName, setBoardName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const changeID = (event) => {
    setBoardID(event.target.value);
    setErrorMessage('');
  };

  const changeName = (event) => {
    setBoardName(event.target.value);
    setErrorMessage('');
  };

  const cancel = () => {
    setErrorMessage('');
    setBoardID('');
    setBoardName('');
    enableForm();
  };

  const updateUserBoards = () => {
    const userBoards = [...user.boards];
    userBoards.push({ id: boardID, name: boardName });
    setUser({
      ...user,
      boards: userBoards,
    });
  };

  const submitForm = async () => {
    if (
      boardID.length >= 1
      && boardID.length <= 5
      && boardName.length >= 1
      && boardName.length <= 20
      && boardID.match(/^[a-z]{1,5}$/)
    ) {
      // matches our form requirements
      setErrorMessage('');

      const boardKeys = [];
      boards.forEach((board) => {
        boardKeys.push(board.id);
      });

      if (boardKeys.includes(boardID)) {
        // already a board with this id
        setErrorMessage('Board ID already used. Try another.');
      } else {
        // good to go!
        await setDoc(doc(database, 'boards', boardID), {
          name: boardName,
          owner: user.uid,
          posts: {},
          threads: [],
        });
        updateUserBoards();
        navigate(`/${boardID}`);
        setErrorMessage('');
        setBoardID('');
        setBoardName('');
        enableForm();
      }
    } else {
      setErrorMessage('Invalid ID or name. Try again.');
    }
  };

  return (
    <form
      className={enabled ? 'new-board-form visible' : 'new-board-form hidden'}
    >
      <h2>New Board:</h2>
      <label htmlFor="new-board-id">
        Board ID:
        <input
          id="new-board-id"
          minLength={1}
          maxLength={5}
          onChange={changeID}
          pattern="^[a-z]{1,5}$"
          type="text"
          value={boardID}
        />
        <span>1-5 lowercase letters</span>
      </label>
      <label htmlFor="new-board-name">
        Board Name:
        <input
          type="text"
          id="new-board-name"
          minLength={1}
          maxLength={20}
          onChange={changeName}
          value={boardName}
        />
        <span>a title for your board</span>
      </label>
      <button onClick={submitForm} type="button">
        SUBMIT
      </button>
      <button onClick={cancel} type="button">
        CANCEL
      </button>
      <span>{errorMessage}</span>
    </form>
  );
}
