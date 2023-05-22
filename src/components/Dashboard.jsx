import React from 'react';
import Login from './Login';
import UserBoards from './UserBoards';
import UserThreads from './UserThreads';

export default function Dashboard({ boards, setUser, user }) {
  if (user === 'loading') {
    return (
      <div>
        Loading...
      </div>
    );
  }
  if (user) {
    return (
      <div className="dashboard">
        <h1>{`Welcome ${user.displayName}`}</h1>
        <UserBoards boards={boards} user={user} setUser={setUser} />
        <UserThreads user={user} />
      </div>
    );
  }
  return (
    <Login />
  );
}
