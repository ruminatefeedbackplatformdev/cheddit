import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import database from '../util/firestore';
import Header from './Header';
import RouteSwitch from './RouteSwitch';
import Footer from './Footer';

async function checkIfNewUser(user) {
  // create user document in firestore if this is their first login
  const querySnapshot = await getDocs(collection(database, 'users'));
  const { docs } = querySnapshot;
  for (let i = 0; i < docs.length; i += 1) {
    if (docs[i].id === user.uid) {
      return false;
    }
  }
  return true;
}

async function getOwnedBoards(user) {
  // figure out which boards the user owns
  const boardsQuery = query(
    collection(database, 'boards'),
    where('owner', '==', user.uid),
  );
  const ownedBoards = await getDocs(boardsQuery);
  const boards = [];
  ownedBoards.forEach((board) => {
    boards.push({ id: board.id, name: board.data().name });
  });
  return boards;
}

export default function App() {
  const [boards, setBoards] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser('loading');
    // listen for auth changes & update state accordingly
    const auth = getAuth();
    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // new user?
        if (await checkIfNewUser(authUser)) {
          // create their document in firestore if so
          await setDoc(doc(database, 'users', authUser.uid), {
            authProvider: authUser.providerData[0].providerId,
            email: authUser.email,
          });
          // then set the local state accordingly
          setUser({
            authProvider: authUser.providerData[0].providerId,
            boards: [],
            displayName: authUser.displayName,
            email: authUser.email,
            photoURL: authUser.photoURL,
            uid: authUser.uid,
          });
        } else {
          // otherwise just load up the info we need from firebase
          setUser({
            authProvider: authUser.providerData[0].providerId,
            boards: await getOwnedBoards(authUser),
            displayName: authUser.displayName,
            email: authUser.email,
            photoURL: authUser.photoURL,
            uid: authUser.uid,
          });
        }
      } else {
        // nobody is logged in
        setUser(null);
      }
    });

    // get info on all the boards from the database
    const q = query(collection(database, 'boards'));
    onSnapshot(q, (querySnapshot) => {
      const allBoards = [];
      querySnapshot.forEach((docu) => {
        const thisBoard = {};
        thisBoard.id = docu.id;
        thisBoard.name = docu.data().name;
        thisBoard.owner = docu.data().owner;
        thisBoard.posts = docu.data().posts;
        thisBoard.rules = docu.data().rules;
        thisBoard.threads = docu.data().threads;
        allBoards.push(thisBoard);
      });
      setBoards(allBoards);
    });
  }, []);

  return (
    <div className="container">
      <Header setUser={setUser} user={user} />
      <RouteSwitch
        boards={boards}
        setBoards={setBoards}
        setUser={setUser}
        user={user}
      />
      <Footer />
    </div>
  );
}
