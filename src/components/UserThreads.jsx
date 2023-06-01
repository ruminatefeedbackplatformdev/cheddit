import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import database from '../util/firestore';

export default function UserThreads({ user }) {
  const [threads, setThreads] = useState({});
  const [threadSubjects, setThreadSubjects] = useState(null);

  const getThreadSubjects = async (userThreads) => {
    // first we need an object to track of our subjects for each board
    const subjects = {};
    const boards = Object.keys(userThreads);
    boards.forEach((board) => {
      subjects[board] = {};
      userThreads[board].forEach((thread) => {
        subjects[board][thread] = '';
      });
    });

    // now load up all the boards
    const boardsQuery = await getDocs(collection(database, 'boards'));
    boardsQuery.forEach((query) => {
      const board = query.id;
      const { posts } = query.data();
      const postKeys = Object.keys(posts);
      postKeys.forEach((post) => {
        // find our threads and store their subjects accordingly
        if (boards.includes(board) && userThreads[board].includes(+post)) {
          subjects[board][post] = posts[post].subject;
        }
      });
    });
    return subjects;
  };

  const getUsersThreads = async () => {
    const boardsQuery = await getDocs(collection(database, 'boards'));
    const usersThreads = {};
    boardsQuery.forEach((query) => {
      const board = query.id;
      const { posts } = query.data();
      const boardThreads = query.data().threads;
      boardThreads.forEach((thread) => {
        if (posts[thread].authorID === user.uid) {
          if (!Object.keys(usersThreads).includes(board)) {
            usersThreads[board] = [];
          }
          usersThreads[board].push(thread);
        }
      });
    });
    return usersThreads;
  };

  useEffect(() => {
    const loadFromDatabase = async () => {
      const usersThreads = await getUsersThreads();
      setThreads(usersThreads);
      const subjects = await getThreadSubjects(usersThreads);
      setThreadSubjects(subjects);
    };
    loadFromDatabase();
  }, [user]);

  return (
    <div className="user-threads">
      <h2>Your Threads</h2>
      {Object.keys(threads).map((board) => threads[board].map((thread) => (
        <Link key={`ut-${board}t${thread}`} to={`/${board}_t${thread}`}>
          {`/${board}/ - #${thread} (${
            threadSubjects ? threadSubjects[board][thread] : null
          })`}
        </Link>
      )))}
    </div>
  );
}
