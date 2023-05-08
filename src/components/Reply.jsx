import React, { useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  getDownloadURL, getStorage, ref, uploadBytes,
} from 'firebase/storage';
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
  const [file, setFile] = useState(null);

  const changeAuthor = (event) => {
    setPostAuthor(event.target.value);
  };

  const changeContent = (event) => {
    setPostContent(event.target.value);
  };

  const changeFile = (event) => {
    setFile(event.target.files[0]);
  };

  const enableForm = () => {
    setEnabled(!enabled);
  };

  const uploadImage = async (newPostNumber) => {
    const storage = getStorage();
    const extension = file.name.match(/\.[a-zA-Z0-9]+$/).join();
    const imageRef = ref(storage, `${board}/${newPostNumber}${extension}`);
    let downloadURL = null;
    try {
      const snapshot = await uploadBytes(imageRef, file);
      downloadURL = await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error(`Error uploading file: ${error}`);
    }
    return downloadURL;
  };

  const submitPost = async () => {
    const newPost = {
      author: postAuthor === '' ? null : postAuthor,
      content: postContent,
      // XXX
      image: null,
      replies: [],
      subject: null,
      thread,
      time: Date.now(),
    };
    const newPostNumber = await getNewPostNumber(board);
    const update = {};
    const updateKey = `posts.${newPostNumber}`;
    update[updateKey] = newPost;

    if (file) {
      const URL = await uploadImage(newPostNumber);
      update[updateKey].image = URL;
    }

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
            onChange={changeFile}
            type="file"
          />
        </label>
        <button onClick={enableForm} type="button">
          CANCEL
        </button>
        <button onClick={submitPost} type="button">
          POST
        </button>
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
