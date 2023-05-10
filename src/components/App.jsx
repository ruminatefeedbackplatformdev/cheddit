import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import database from '../util/firestore';
import Header from './Header';
import Home from './Home';
import Board from './Board';
import Thread from './Thread';
import Footer from './Footer';

export default function App() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const readDatabase = async () => {
      const querySnapshot = await getDocs(collection(database, 'boards'));
      const allBoards = [];
      querySnapshot.forEach((doc) => {
        const thisBoard = {};
        thisBoard.id = doc.id;
        thisBoard.name = doc.data().name;
        thisBoard.threads = doc.data().threads;
        allBoards.push(thisBoard);
      });
      setBoards(allBoards);
    };
    readDatabase();
  }, []);

  return (
    <div className="container">
      <Header />
      <Routes>
        <Route
          path="/"
          element={<Home boards={boards} setBoards={setBoards} />}
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
      <Footer />
    </div>
  );
}
