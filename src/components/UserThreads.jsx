import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import database from '../util/firestore';

export default function UserThreads({ user }) {
  const { threads } = user;

  const [threadSubjects, setThreadSubjects] = useState(null);

  const getThreadSubjects = async () => {
    // first we need an object to track of our subjects for each board
    const subjects = {};
    const boards = Object.keys(threads);
    boards.forEach((board) => {
      subjects[board] = {};
      threads[board].forEach((thread) => {
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
        if (boards.includes(board) && threads[board].includes(+post)) {
          subjects[board][post] = posts[post].subject;
        }
      });
    });
    return subjects;
  };

  useEffect(() => {
    const loadFromDatabase = async () => {
      const subjects = await getThreadSubjects();
      setThreadSubjects(subjects);
    };
    loadFromDatabase();
  }, []);

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
