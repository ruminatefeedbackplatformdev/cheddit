import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import NewThread from './NewThread';
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
    firstPosts.push({
      author: op.author,
      content: op.content,
      image: op.image,
      number: thread,
      replies: op.replies,
      subject: op.subject,
      time: op.time,
    });
  });
  return firstPosts;
}

async function getPostCounts(id) {
  const { posts, threads } = await loadBoard(id);
  const postKeys = Object.keys(posts);
  const postCounts = {};
  threads.forEach((thread) => {
    postCounts[thread] = 0;
  });

  postKeys.forEach((key) => {
    const thisPost = posts[key];
    postCounts[thisPost.thread] += 1;
  });

  return postCounts;
}

export default function Board({ id, name }) {
  const [threads, setThreads] = useState([]);
  const [postCounts, setPostCounts] = useState({});

  const readDatabase = async () => {
    setThreads(await loadThreads(id));
    setPostCounts(await getPostCounts(id));
  };

  useEffect(() => {
    readDatabase();
  }, []);

  if (threads.length > 0) {
    return (
      <main className="board">
        <h1>{`/${id}/ - ${name}`}</h1>
        <NewThread board={id} readDatabase={readDatabase} />
        {threads.map((thread) => (
          <div key={`board${id}-post#${thread.number}`}>
            <Post
              author={thread.author}
              content={thread.content}
              image={thread.image}
              number={thread.number}
              replies={thread.replies}
              subject={thread.subject}
              thread={thread.number}
              time={thread.time}
            />
            <span>
              {`${postCounts[thread.number]} ${
                postCounts[thread.number] === 1 ? 'post' : 'posts'
              } - `}
              <Link to={`/${id}_t${thread.number}`}>View thread</Link>
            </span>
          </div>
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
