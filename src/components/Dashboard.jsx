import React, { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import database from '../util/firestore';
import Login from './Login';
import UserBoards from './UserBoards';
import UserThreads from './UserThreads';
import hourglass from '../images/loading.gif';

export default function Dashboard({ boards, setUser, user }) {
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  const changeName = (event) => {
    setDisplayName(event.target.value);
  };

  const submitNameChange = () => {
    // change local user state
    setUser({
      ...user,
      displayName,
    });

    // and then update the database accordingly
    const userRef = doc(database, 'users', user.uid);
    setDoc(userRef, { displayName }, { merge: true });
  };

  if (user === 'loading') {
    return (
      <div className="dashboard-loading">
        <span>Loading...</span>
        <img src={hourglass} alt="" />
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
              onChange={changeName}
              type="text"
              value={displayName || ''}
            />
          </label>
          <button onClick={submitNameChange} type="button">
            Change Name
          </button>
        </form>
        <UserBoards boards={boards} user={user} setUser={setUser} />
        <UserThreads user={user} />
      </div>
    );
  }
  return <Login />;
}
