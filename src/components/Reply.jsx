import React, { useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import database from '../util/firestore';

async function loadBoard(id) {
  const boardRef = doc(database, 'boards', id);
  const boardSnap = await getDoc(boardRef);
  return boardSnap.data();
}

async function getNewPostNumber(id) {
  const board = await loadBoard(id);
  const lastPost = Object.keys(board.posts);
  return +lastPost[lastPost.length - 1] + 1;
}

export default function Reply({ board, thread }) {
  const [enabled, setEnabled] = useState(false);
  const [postAuthor, setPostAuthor] = useState('');
  const [postContent, setPostContent] = useState('');

  const changeAuthor = (event) => {
    setPostAuthor(event.target.value);
  };

  const changeContent = (event) => {
    setPostContent(event.target.value);
  };

  const enableForm = () => {
    setEnabled(!enabled);
  };

  const submitPost = async () => {
    const newPost = {
      author: postAuthor === '' ? null : postAuthor,
      content: postContent,
      // XXX
      image: '#',
      replies: [],
      subject: null,
      thread,
      time: Date.now(),
    };
    const newPostNumber = await getNewPostNumber(board);
    const update = {};
    const updateKey = `posts.${newPostNumber}`;
    update[updateKey] = newPost;

    const boardRef = doc(database, 'boards', board);
    await updateDoc(boardRef, update);
  };

  if (enabled) {
    return (
      <form aria-label="reply form">
        <label htmlFor="post-author">
          Name:
          <input
            id="post-author"
            name="post-author"
            onChange={changeAuthor}
            type="text"
            placeholder="Anonymous"
            value={postAuthor}
          />
        </label>
        <label htmlFor="post-content">
          Comment:
          <textarea
            id="post-content"
            name="post-content"
            onChange={changeContent}
            value={postContent}
          />
        </label>
        <label htmlFor="post-image">
          Image:
          <input
            accept="image/jpeg, image/gif, image/png"
            id="post-image"
            name="post=image"
            type="file"
          />
        </label>
        <button onClick={enableForm} type="button">CANCEL</button>
        <button onClick={submitPost} type="button">POST</button>
      </form>
    );
  }

  return (
    <div>
      <button onClick={enableForm} type="button">
        [ Post a Reply ]
      </button>
    </div>
  );
}
