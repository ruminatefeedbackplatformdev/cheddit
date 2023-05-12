import React from 'react';
import Login from './Login';
import UserBoards from './UserBoards';

export default function Dashboard({ user }) {
  if (user) {
    return (
      <div>
        <h1>{`Welcome ${user.displayName}`}</h1>
        <UserBoards user={user} />
      </div>
    );
  }
  return (
    <Login />
  );
}
