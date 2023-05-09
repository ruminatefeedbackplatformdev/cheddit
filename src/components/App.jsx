import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import database from '../util/firestore';
import Header from './Header';
import Home from './Home';
import Board from './Board';
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
            path={`/${board.id}`}
            element={<Board id={board.id} name={board.name} />}
          />
        ))}
      </Routes>
      <Footer />
    </div>
  );
}
