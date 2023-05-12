import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { collection, onSnapshot, query } from 'firebase/firestore';
import database from '../util/firestore';
import Home from './Home';
import Dashboard from './Dashboard';
import Board from './Board';
import Thread from './Thread';

export default function RouteSwitch({ boards, setBoards, user }) {
  useEffect(() => {
    // get info on all the boards from the database
    const q = query(collection(database, 'boards'));
    onSnapshot(q, (querySnapshot) => {
      const allBoards = [];
      querySnapshot.forEach((doc) => {
        const thisBoard = {};
        thisBoard.id = doc.id;
        thisBoard.name = doc.data().name;
        thisBoard.owner = doc.data().owner;
        thisBoard.threads = doc.data().threads;
        allBoards.push(thisBoard);
      });
      setBoards(allBoards);
    });
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={<Home boards={boards} setBoards={setBoards} />}
      />
      <Route path="/dash" element={<Dashboard user={user} />} />
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
