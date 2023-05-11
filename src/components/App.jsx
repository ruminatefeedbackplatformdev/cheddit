import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from './Header';
import RouteSwitch from './RouteSwitch';
import Footer from './Footer';

export default function App() {
  const [boards, setBoards] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
  }, []);

  return (
    <div className="container">
      <Header user={user} />
      <RouteSwitch boards={boards} setBoards={setBoards} user={user} />
      <Footer />
    </div>
  );
}
