import React from 'react';
import Login from './Login';
import UserBoards from './UserBoards';

export default function Dashboard({ boards, setUser, user }) {
  if (user) {
    return (
      <div className="dashboard">
        <h1>{`Welcome ${user.displayName}`}</h1>
        <UserBoards boards={boards} user={user} setUser={setUser} />
      </div>
    );
  }
  return (
    <Login />
  );
}
