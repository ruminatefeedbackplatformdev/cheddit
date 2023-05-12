import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  arrayUnion, doc, getDoc, updateDoc,
} from 'firebase/firestore';
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
  const boardPosts = Object.keys(board.posts);
  if (Object.keys(boardPosts).length === 0) {
    return 1;
  }
  return +boardPosts[boardPosts.length - 1] + 1;
}

export default function NewThread({ board, readDatabase }) {
  const [enabled, setEnabled] = useState(false);
  const [threadAuthor, setThreadAuthor] = useState('');
  const [threadSubject, setThreadSubject] = useState('');
  const [threadContent, setThreadContent] = useState('');
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const enableForm = () => {
    setEnabled(!enabled);
  };

  const changeAuthor = (event) => {
    setThreadAuthor(event.target.value);
  };

  const changeSubject = (event) => {
    setThreadSubject(event.target.value);
  };

  const changeContent = (event) => {
    setThreadContent(event.target.value);
  };

  const changeFile = (event) => {
    setFile(event.target.files[0]);
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

  const submitThread = async () => {
    const newPost = {
      author: threadAuthor === '' ? null : threadAuthor,
      content: threadContent,
      image: null,
      replies: [],
      subject: threadSubject,
      thread: null,
      time: Date.now(),
    };

    // we're updating nested fields in firestore
    const newPostNumber = await getNewPostNumber(board);
    const update = {};
    const updateKey = `posts.${newPostNumber}`;
    update[updateKey] = newPost;
    update[updateKey].thread = newPostNumber;

    if (file) {
      const URL = await uploadImage(newPostNumber);
      update[updateKey].image = URL;
    }

    const boardRef = doc(database, 'boards', board);
    await updateDoc(boardRef, update);
    await updateDoc(boardRef, {
      threads: arrayUnion(newPostNumber),
    });

    // reset the form
    setThreadAuthor('');
    setThreadSubject('');
    setThreadContent('');
    setFile(null);
    enableForm();

    // this will update the threads for the parent board
    await readDatabase();

    // take the user to the thread they just created
    navigate(`/${board}_t${newPostNumber}`);
  };

  if (enabled) {
    return (
      <div className="new-thread-container">
        <form aria-label="thread form" className="thread-form">
          <label htmlFor="thread-author">
            Name:
            <input
              id="thread-author"
              name="thread-author"
              onChange={changeAuthor}
              type="text"
              placeholder="Anonymous"
              value={threadAuthor}
            />
          </label>
          <label htmlFor="thread-subject">
            Subject:
            <input
              id="thread-subject"
              name="thread-subject"
              onChange={changeSubject}
              type="text"
              value={threadSubject}
            />
          </label>
          <label htmlFor="thread-content">
            Comment:
            <textarea
              id="thread-content"
              name="thread-content"
              onChange={changeContent}
              rows="6"
              value={threadContent}
            />
          </label>
          <label htmlFor="thread-image">
            Image:
            <input
              accept="image/jpeg, image/gif, image/png"
              id="thread-image"
              name="thread-image"
              onChange={changeFile}
              type="file"
            />
          </label>
          <div className="buttons">
            <button onClick={enableForm} type="button">
              CANCEL
            </button>
            <button onClick={submitThread} type="button">
              POST
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <button onClick={enableForm} type="button">
        Start a Thread
      </button>
    </div>
  );
}
