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
      authorID: op.authorID,
      content: op.content,
      image: op.image,
      isSticky: op.isSticky,
      number: thread,
      replies: op.replies,
      subject: op.subject,
      thumb: op.thumb,
      time: op.time,
    });
  });
  return firstPosts;
}

async function getPostsInfo(id) {
  // get all the post numbers in each thread
  const { posts, threads } = await loadBoard(id);
  if (threads.length) {
    const threadPosts = {};
    threads.forEach((thread) => {
      threadPosts[thread] = [];
    });

    const postKeys = Object.keys(posts);
    postKeys.forEach((key) => {
      const thisPost = posts[key];
      threadPosts[thisPost.thread].push(+key);
    });

    return threadPosts;
  }
  return {};
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

export default function Board({
  boards, id, name, setUser, user,
}) {
  const [threads, setThreads] = useState([]);
  const [postCounts, setPostCounts] = useState({});
  const [threadReplies, setThreadReplies] = useState({});

  const sortSticky = (threadsToSort) => {
    // put the sticky threads first
    const sticky = [];
    const normal = [];
    threadsToSort.forEach((thread) => {
      if (thread.isSticky) {
        sticky.push(thread);
      } else {
        normal.push(thread);
      }
    });
    const sorted = sticky.concat(normal);
    return sorted;
  };

  const readDatabase = async () => {
    const threadPosts = await getPostsInfo(id);
    setPostCounts(getPostCounts(threadPosts));

    const threadsFromDB = await loadThreads(id);
    threadsFromDB.sort((a, b) => {
      // will sort threads by their last post numbers (descending)
      const threadA = threadPosts[a.number];
      const threadB = threadPosts[b.number];
      return threadB[threadB.length - 1] - threadA[threadA.length - 1];
    });
    // gotta put the sticky threads first
    setThreads(sortSticky(threadsFromDB));
  };

  const loadReplies = async (threadPosts) => {
    const { posts } = await loadBoard(id);
    const lastFewReplies = {};
    Object.keys(threadPosts).forEach((thread) => {
      lastFewReplies[thread] = {};
      threadPosts[thread].forEach((post) => {
        lastFewReplies[thread][post] = { ...posts[post] };
      });
    });
    return lastFewReplies;
  };

  const readThreadReplies = async () => {
    const threadPosts = await getPostsInfo(id);
    Object.keys(threadPosts).forEach((thread) => {
      // just need the last few post numbers
      if (threadPosts[thread].length > 3) {
        threadPosts[thread] = threadPosts[thread].slice(-3);
      }
      // but we don't want to repeat the OP
      if (threadPosts[thread].includes(+thread)) {
        const index = threadPosts[thread].indexOf(+thread);
        threadPosts[thread].splice(index, 1);
      }
    });

    const lastFewReplies = await loadReplies(threadPosts);
    setThreadReplies(lastFewReplies);
  };

  useEffect(() => {
    readDatabase();
    readThreadReplies();
  }, [boards]);

  if (threads.length > 0) {
    return (
      <main className="board">
        <h1>{`/${id}/ - ${name}`}</h1>
        <NewThread
          board={id}
          readDatabase={readDatabase}
          setUser={setUser}
          user={user}
        />
        {threads.map((thread) => (
          <div key={`board${id}-post#${thread.number}`}>
            <Post
              author={thread.author}
              authorID={thread.authorID}
              board={id}
              content={thread.content}
              image={thread.image}
              isSticky={thread.isSticky}
              number={thread.number}
              replies={thread.replies}
              setUser={setUser}
              subject={thread.subject}
              thread={thread.number}
              thumb={thread.thumb}
              time={thread.time}
              user={user}
            />
            <span>
              {`${postCounts[thread.number]} ${
                postCounts[thread.number] === 1 ? 'post' : 'posts'
              } - `}
              <Link to={`/${id}_t${thread.number}`}>View thread</Link>
            </span>
            <div className="thread-replies">
              {Object.keys(threadReplies[+thread.number]).map((postNumber) => {
                const post = threadReplies[+thread.number][postNumber];
                return (
                  <Post
                    author={post.author}
                    authorID={post.authorID}
                    board={id}
                    content={post.content}
                    image={post.image}
                    isSticky={post.isSticky}
                    key={`${id}/${post.thread}/${postNumber}`}
                    number={+postNumber}
                    replies={post.replies}
                    setUser={setUser}
                    subject={post.subject}
                    thread={post.thread}
                    thumb={post.thumb}
                    time={post.time}
                    user={user}
                  />
                );
              })}
            </div>
            <hr />
          </div>
        ))}
      </main>
    );
  }
  return (
    <main className="board">
      <h1>{`/${id}/ - ${name}`}</h1>
      <NewThread
        board={id}
        readDatabase={readDatabase}
        setUser={setUser}
        user={user}
      />
      <span>Nothing to see here...</span>
    </main>
  );
}
