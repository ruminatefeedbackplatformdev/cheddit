import React, { useEffect, useState } from 'react';
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
  const [error, setError] = useState(null);
  const [validID, setValidID] = useState(false);
  const [validName, setValidName] = useState(false);
  const [validRules, setValidRules] = useState(true);

  useEffect(() => {
    if (boardID === '' && boardName === '') {
      setError('board ID and name required');
    }
    if (validID && boardName === '') {
      setError('board name required');
    }
    if (validName && boardID === '') {
      setError('board ID required');
    }
    if (!validID && boardID !== '') {
      setError('invalid ID (1-5 lowercase letters only)');
    }
    if (validID && validName) {
      if (validRules) {
        setError(null);
      } else {
        setError('no blank rules');
      }
    }
  }, [boardID, boardName, boardRules]);

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
    setValidRules(false);
  };

  const cancel = () => {
    setError('board ID and name required');
    setBoardID('');
    setBoardName('');
    setBoardRules([]);
    setValidID(false);
    setValidName(false);
    enableForm();
  };

  const changeID = (event) => {
    const { validity } = event.target;
    setValidID(validity.valid);
    setBoardID(event.target.value);
  };

  const changeName = (event) => {
    const { validity } = event.target;
    setValidName(validity.valid);
    setBoardName(event.target.value);
  };

  const changeRule = (event) => {
    // find the right element & change it's rule
    setValidRules(event.target.validity.valid);
    const newRules = [...boardRules];
    const { id } = event.target.dataset;
    const ruleIndex = newRules.findIndex((element) => element.id === +id);
    newRules[ruleIndex].rule = event.target.value;
    setBoardRules(newRules);
  };

  const deleteRule = (event) => {
    // find the right element and remove it
    const newRules = [...boardRules];
    const { id } = event.target.dataset;
    const ruleIndex = newRules.findIndex((element) => element.id === +id);
    newRules.splice(ruleIndex, 1);
    // gotta check for any blank rules left over
    if (!newRules.length) {
      setValidRules(true);
    } else {
      newRules.forEach((rule) => {
        if (rule.rule === '') {
          setValidRules(false);
        } else {
          setValidRules(true);
        }
      });
    }
    setBoardRules(newRules);
  };

  const navigate = useNavigate();

  const updateUserBoards = () => {
    const userBoards = [...user.boards];
    userBoards.push({ id: boardID, name: boardName });
    setUser({
      ...user,
      boards: userBoards,
    });
  };

  const submitForm = async () => {
    try {
      const restrictedIDs = [
        'dash',
        'rules',
      ];

      if (
        boardID.length >= 1
        && boardID.length <= 5
        && boardName.length >= 1
        && boardName.length <= 20
        && boardID.match(/^[a-z]{1,5}$/)
      ) {
        // matches our form requirements
        setError(null);

        const boardKeys = [];
        boards.forEach((board) => {
          boardKeys.push(board.id);
        });

        if (boardKeys.includes(boardID)) {
          // already a board with this id
          setError('Board ID already used. Try another.');
        } else if (restrictedIDs.includes(boardID)) {
          setError('Restricted ID. Try another.');
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
          setError(null);
          setValidID(false);
          setValidName(false);
          setBoardID('');
          setBoardName('');
          setBoardRules([]);
          enableForm();
        }
      } else {
        setError('Invalid ID or name. Try again.');
      }
    } catch (err) {
      console.error(err);
      const { code } = { ...err };
      setError(code);
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
          required
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
          required
          value={boardName}
        />
        <span>a title for your board</span>
      </label>
      <span className={error ? 'error' : 'error hidden'}>{error}</span>
      <h3>Board Rules:</h3>
      <span>(optional - global rules always apply)</span>
      {boardRules.map((rule) => (
        <label
          htmlFor={`new-board-rule#${rule.id}`}
          key={`new-board-rule#${rule.id}`}
        >
          {`Rule #${boardRules.indexOf(rule) + 1}`}
          <textarea
            data-id={rule.id}
            id={`new-board-rule#${rule.id}`}
            minLength={1}
            onChange={changeRule}
            required
            value={rule.rule}
          />
          <button data-id={rule.id} onClick={deleteRule} type="button">
            Delete Rule
          </button>
        </label>
      ))}

      <button onClick={addRule} type="button">
        Add Rule
      </button>
      <button
        disabled={error || !validID || !validName || !validRules}
        onClick={submitForm}
        type="button"
      >
        Submit
      </button>
      <button onClick={cancel} type="button">
        Cancel
      </button>
    </form>
  );
}
