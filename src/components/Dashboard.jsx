import React from 'react';
import Login from './Login';

export default function Dashboard({ user }) {
  if (user) {
    return (
      <div>
        <span>User is logged in!</span>
      </div>
    );
  }
  return (
    <Login />
  );
}
