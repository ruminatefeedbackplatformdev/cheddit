import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import NewThread from './NewThread';
import Post from './Post';
import database from '../util/firestore';

async function loadBoard(id) {
  // get the board info from firebase
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

async function getPostsInfo(id) {
  // get all the post numbers in each thread
  const { posts, threads } = await loadBoard(id);
  const postKeys = Object.keys(posts);
  const threadPosts = {};
  threads.forEach((thread) => {
    threadPosts[thread] = [];
  });

  postKeys.forEach((key) => {
    const thisPost = posts[key];
    threadPosts[thisPost.thread].push(+key);
  });

  return threadPosts;
}

function getPostCounts(posts) {
  // count up how many post each thread has
  const postCounts = {};
  const keys = Object.keys(posts);
  keys.forEach((key) => {
    postCounts[key] = posts[key].length;
  });
  return postCounts;
}

export default function Board({ id, name }) {
  const [threads, setThreads] = useState([]);
  const [postCounts, setPostCounts] = useState({});

  const readDatabase = async () => {
    const threadPosts = await getPostsInfo(id);
    setPostCounts(getPostCounts(threadPosts));

    const threadsFromDB = await (loadThreads(id));
    threadsFromDB.sort((a, b) => {
      // will sort threads by their last post numbers (descending)
      const threadA = threadPosts[a.number];
      const threadB = threadPosts[b.number];
      return threadB[threadB.length - 1] - threadA[threadA.length - 1];
    });
    setThreads(threadsFromDB);
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
    <main className="board">
      <h1>{`/${id}/ - ${name}`}</h1>
      <NewThread board={id} readDatabase={readDatabase} />
      <span>Nothing to see here...</span>
    </main>
  );
}
