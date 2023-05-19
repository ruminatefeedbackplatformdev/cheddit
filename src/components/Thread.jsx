import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import database from '../util/firestore';
import Reply from './Reply';
import Post from './Post';

async function loadBoard(id) {
  // get the board info from firebase
  const boardRef = doc(database, 'boards', id);
  const boardSnap = await getDoc(boardRef);
  return boardSnap.data();
}

async function loadPosts(board, op) {
  // get all the posts for this thread
  const { posts } = await loadBoard(board);
  const postKeys = Object.keys(posts);
  const threadPosts = [];
  postKeys.forEach((key) => {
    if (posts[key].thread === op) {
      posts[key].number = +key;
      threadPosts.push(posts[key]);
    }
  });
  return threadPosts;
}

export default function Thread({
  board, boards, name, op, setUser, user,
}) {
  const [posts, setPosts] = useState([]);

  const readDatabase = async () => {
    setPosts(await loadPosts(board, op));
  };

  useEffect(() => {
    readDatabase();
  }, [boards]);

  if (posts.length > 0) {
    return (
      <div aria-label="thread" className="thread">
        <h1>{`/${board}/ - ${name}`}</h1>
        <Reply
          board={board}
          thread={op}
          readDatabase={readDatabase}
          user={user}
        />
        {posts.map((post) => (
          <Post
            author={post.author}
            board={board}
            content={post.content}
            image={post.image}
            number={post.number}
            key={post.number}
            replies={post.replies}
            setUser={setUser}
            subject={post.subject}
            thread={op}
            thumb={post.thumb}
            time={post.time}
            user={user}
          />
        ))}
      </div>
    );
  }
  return (
    <div aria-label="thread" className="thread">
      <span>Loading...</span>
    </div>
  );
}
