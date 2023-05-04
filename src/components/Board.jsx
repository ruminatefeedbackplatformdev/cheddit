import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import Post from './Post';
import database from '../util/firestore';

async function loadBoard(id) {
  const boardRef = doc(database, 'boards', id);
  const boardSnap = await getDoc(boardRef);
  return boardSnap.data();
}

async function loadThreads(id) {
  // read the database and get array of threads
  const { posts, threads } = await loadBoard(id);
  const firstPosts = [];
  threads.forEach((thread) => {
    const op = posts[thread];
    firstPosts.push(
      {
        author: op.author,
        content: op.content,
        image: op.image,
        number: thread,
        replies: op.replies,
        subject: op.subject,
        time: op.time,
      },
    );
  });
  return firstPosts;
}

export default function Board({ id }) {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const readDatabase = async () => {
      setThreads(await loadThreads(id));
    };
    readDatabase();
  }, []);

  if (threads.length > 0) {
    return (
      <main>
        {threads.map((thread) => (
          <Post
            author={thread.author}
            content={thread.content}
            image={thread.image}
            key={thread.number}
            number={thread.number}
            replies={thread.replies}
            subject={thread.subject}
            time={thread.time}
          />
        ))}
      </main>
    );
  }
  return (
    <main>
      <span>Nothing to see here...</span>
    </main>
  );
}
