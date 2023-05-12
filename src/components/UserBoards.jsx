import React from 'react';

export default function UserBoards({ user }) {
  return (
    <div className="user-boards">
      <h2>Your Boards</h2>
      {user.boards.map((board) => (
        <span key={`ub-${board.id}`}>{`/${board.id}/ - ${board.name}`}</span>
      ))}
    </div>
  );
}
