import React, { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import database from '../util/firestore';

export default function BoardRules({ board, user }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [rules, setRules] = useState([]);
  const [validRules, setValidRules] = useState(true);

  useEffect(() => {
    setRules(board.rules);
  }, []);

  useEffect(() => {
    const anyBlankRules = () => {
      let blank = false;
      rules.forEach((rule) => {
        if (rule.rule === '') {
          blank = true;
        }
      });
      return blank;
    };

    if (anyBlankRules()) {
      setValidRules(false);
      setError('no blank rules');
    } else {
      setValidRules(true);
      setError(null);
    }
  }, [rules]);

  const addRule = () => {
    // need unquie ID for each rule (for mapping)
    const newRules = [...rules];
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

    setRules(newRules);
  };

  const cancelEdit = () => {
    setRules(board.rules);
    setEditing(!editing);
    setError(null);
    setValidRules(true);
  };

  const deleteRule = (event) => {
    const { id } = event.target.dataset;
    const newRules = [...rules];
    const index = newRules.findIndex((element) => +element.id === +id);
    newRules.splice(index, 1);
    setRules(newRules);
  };

  const editRule = (event) => {
    const { id } = event.target.dataset;
    const newRules = [...rules];
    const index = newRules.findIndex((element) => +element.id === +id);
    const newRule = { ...newRules[index] };
    newRule.rule = event.target.value;
    newRules[index] = newRule;
    setRules(newRules);
  };

  const submitEdit = () => {
    try {
      const boardRef = doc(database, 'boards', board.id);
      setDoc(boardRef, { rules }, { merge: true });
      setEditing(!editing);
    } catch (err) {
      const { code } = { ...err };
      console.error(err);
      setError(`server error: ${code}`);
    }
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  return (
    <div>
      <h2>
        {`/${board.id}/ - ${board.name}`}
        {user && user.uid === board.owner ? (
          <button hidden={editing} onClick={toggleEdit} type="button">
            Edit Rules
          </button>
        ) : null}
      </h2>
      {rules.length ? (
        <ol>
          {rules.map((rule) => {
            if (editing) {
              return (
                <li key={`${board.id}-rule#${rule.id}`}>
                  <textarea
                    data-id={rule.id}
                    onChange={editRule}
                    value={rules[rules.indexOf(rule)].rule}
                  />
                  <button data-id={rule.id} onClick={deleteRule} type="button">
                    Delete Rule
                  </button>
                </li>
              );
            }
            return <li key={`${board.id}-rule#${rule.id}`}>{rule.rule}</li>;
          })}
          {editing ? (
            <div>
              <button onClick={addRule} type="button">
                Add Rule
              </button>
              <div>
                <div className="error" hidden={!error}>
                  <span>{error}</span>
                </div>
                <button onClick={cancelEdit} type="button">
                  Cancel
                </button>
                <button
                  disabled={error || !validRules}
                  onClick={submitEdit}
                  type="button"
                >
                  Submit
                </button>
              </div>
            </div>
          ) : null}
        </ol>
      ) : (
        <ol>
          {editing ? (
            <div>
              <button onClick={addRule} type="button">
                Add Rule
              </button>
              <div>
                <div className="error" hidden={!error}>
                  <span>{error}</span>
                </div>
                <button onClick={cancelEdit} type="button">
                  Cancel
                </button>
                <button
                  disabled={error || !validRules}
                  onClick={submitEdit}
                  type="button"
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <li>No additional rules - global rules still apply.</li>
          )}
        </ol>
      )}
    </div>
  );
}
