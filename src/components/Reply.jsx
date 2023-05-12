import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  getDownloadURL, getStorage, ref, uploadBytes,
} from 'firebase/storage';
import database from '../util/firestore';

async function loadBoard(id) {
  // get the board info
  const boardRef = doc(database, 'boards', id);
  const boardSnap = await getDoc(boardRef);
  return boardSnap.data();
}

async function getNewPostNumber(id) {
  // gotta determine a number for the new post
  const board = await loadBoard(id);
  const lastPost = Object.keys(board.posts);
  return +lastPost[lastPost.length - 1] + 1;
}

export default function Reply({ board, readDatabase, thread }) {
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
    // don't preserve the original file names - images are referred to
    // by their respective post's number
    const imageRef = ref(storage, `${board}/${newPostNumber}${extension}`);
    let downloadURL = null;
    try {
      const snapshot = await uploadBytes(imageRef, file);
      downloadURL = await getDownloadURL(snapshot.ref);
    } catch (error) {
      // TODO - need to handle this better
      console.error(`Error uploading file: ${error}`);
    }
    return downloadURL;
  };

  const submitPost = async () => {
    const newPost = {
      author: postAuthor === '' ? null : postAuthor,
      content: postContent,
      image: null,
      replies: [],
      subject: null,
      thread,
      time: Date.now(),
    };

    // we're updating nested fields in firestore
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

    // reset the form
    setPostAuthor('');
    setPostContent('');
    setFile(null);
    enableForm();

    // this will update the posts for the parent thread
    await readDatabase();
  };

  if (enabled) {
    return (
      <div className="reply-container">
        <form aria-label="reply form" className="reply-form">
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
              rows="6"
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
          <div className="buttons">
            <button onClick={enableForm} type="button">
              CANCEL
            </button>
            <button onClick={submitPost} type="button">
              POST
            </button>
          </div>
        </form>
        <Link to={`/${board}`}>{`Back to /${board}/`}</Link>
      </div>
    );
  }

  return (
    <div className="reply-container">
      <button onClick={enableForm} type="button">
        [ Post a Reply ]
      </button>
      <Link to={`/${board}`}>{`Back to /${board}/`}</Link>
    </div>
  );
}
