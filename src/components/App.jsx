import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import database from '../util/firestore';
import Header from './Header';
import RouteSwitch from './RouteSwitch';
import Footer from './Footer';

async function createNewUserDoc(user) {
  // give 'em some empty fields on their first login
  await setDoc(doc(database, 'users', user.uid), {
    boards: [],
    threads: {},
    posts: {},
  });
}

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
    // listen for auth changes & update state accordingly
    const auth = getAuth();
    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // new user?
        if (await checkIfNewUser(authUser)) {
          await createNewUserDoc(authUser);
        }
        // just load up the info we need from firebase
        setUser({
          boards: await getOwnedBoards(authUser),
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
          uid: authUser.uid,
        });
      } else {
        // nobody is logged in
        setUser(null);
      }
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
