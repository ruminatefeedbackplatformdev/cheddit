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
  const [boardRules, setBoardRules] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const addRule = () => {
    // need unquie ID for each rule (for mapping)
    const newRules = [...boardRules];
    const ruleIDs = [];
    newRules.forEach((rule) => {
      ruleIDs.push(+rule.id);
    });

    // start at 1 and keep incrementing until we find an unused ID
    let tryID = 1;
    while (ruleIDs.includes(tryID)) {
      tryID += 1;
    }

    // good to go, start with a blank rule
    newRules.push({
      id: tryID,
      rule: '',
    });
    setBoardRules(newRules);
  };

  const changeRule = (event) => {
    // find the right element & change it's rule
    const newRules = [...boardRules];
    const { id } = event.target.dataset;
    const ruleIndex = newRules.findIndex((element) => element.id === +id);
    newRules[ruleIndex].rule = event.target.value;
    setBoardRules(newRules);
  };

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
    setBoardRules([]);
    enableForm();
  };

  const deleteRule = (event) => {
    // find the right element and remove it
    const newRules = [...boardRules];
    const { id } = event.target.dataset;
    const ruleIndex = newRules.findIndex((element) => element.id === id);
    newRules.splice(ruleIndex, 1);
    setBoardRules(newRules);
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
          rules: boardRules,
          threads: [],
        });
        updateUserBoards();
        navigate(`/${boardID}`);
        setErrorMessage('');
        setBoardID('');
        setBoardName('');
        setBoardRules([]);
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
      <span>{errorMessage}</span>
      <h3>Board Rules:</h3>

      {boardRules.map((rule) => (
        <label
          htmlFor={`new-board-rule#${rule.id}`}
          key={`new-board-rule#${rule.id}`}
        >
          <textarea
            data-id={rule.id}
            id={`new-board-rule#${rule.id}`}
            minLength={1}
            onChange={changeRule}
            value={rule.rule}
          />
          <button data-index={rule.id} onClick={deleteRule} type="button">
            Delete Rule
          </button>
        </label>
      ))}

      <button onClick={addRule} type="button">
        Add Rule
      </button>
      <button onClick={submitForm} type="button">
        SUBMIT
      </button>
      <button onClick={cancel} type="button">
        CANCEL
      </button>
    </form>
  );
}
