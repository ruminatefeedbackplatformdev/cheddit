import React, { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import database from '../util/firestore';
import Login from './Login';
import UserBoards from './UserBoards';
import UserThreads from './UserThreads';
import UserPosts from './UserPosts';
import hourglass from '../images/loading.gif';

export default function Dashboard({ boards, setUser, user }) {
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [validName, setValidName] = useState(true);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  const changeName = (event) => {
    const { maxLength, minLength } = event.target;
    setDisplayName(event.target.value);
    if (event.target.validity.valid) {
      setValidName(true);
      setError(null);
    } else {
      setValidName(false);
      setError(`Name must be between ${minLength}-${maxLength} characters`);
    }
  };

  const submitNameChange = () => {
    try {
      // change local user state
      setUser({
        ...user,
        displayName,
      });

      // and then update the database accordingly
      const userRef = doc(database, 'users', user.uid);
      setDoc(userRef, { displayName }, { merge: true });
    } catch (err) {
      console.error(err);
      const { code } = { ...err };
      setError(code);
    }
  };

  if (user === 'loading') {
    return (
      <div className="dashboard">
        <span className="dashboard-loading">
          Loading...
          <img src={hourglass} alt="" />
        </span>
      </div>
    );
  }
  if (user) {
    return (
      <div className="dashboard">
        <h1>{`Welcome ${user.displayName}`}</h1>
        <form className="change-displayname">
          <label htmlFor="displayname">
            Posting as:
            <input
              id="displayname"
              minLength={1}
              maxLength={20}
              onChange={changeName}
              required
              type="text"
              value={displayName || ''}
            />
          </label>
          <button
            disabled={!validName}
            onClick={submitNameChange}
            type="button"
          >
            Change Name
          </button>
          <span className={error ? 'error' : 'error hidden'}>{error}</span>
        </form>
        <UserBoards boards={boards} user={user} setUser={setUser} />
        <UserThreads user={user} />
        <UserPosts boards={boards} user={user} />
      </div>
    );
  }
  return <Login />;
}
