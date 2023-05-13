import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import Board from './Board';
import Thread from './Thread';

export default function RouteSwitch({ boards, setUser, user }) {
  return (
    <Routes>
      <Route path="/" element={<Home boards={boards} />} />
      <Route
        path="/dash"
        element={<Dashboard boards={boards} user={user} setUser={setUser} />}
      />
      {boards.map((board) => (
        <Route
          key={`route-${board.id}`}
          path={`${board.id}`}
          element={<Board id={board.id} name={board.name} />}
        />
      ))}
      {boards.map((board) => board.threads.map((thread) => (
        <Route
          key={`route-${board.id}_thread-${thread}`}
          path={`${board.id}_t${thread}`}
          element={<Thread board={board.id} name={board.name} op={thread} />}
        />
      )))}
    </Routes>
  );
}
