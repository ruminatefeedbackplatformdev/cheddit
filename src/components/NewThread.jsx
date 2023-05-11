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
  const boardRef = doc(database, 'boards', id);
  const boardSnap = await getDoc(boardRef);
  return boardSnap.data();
}

async function getNewPostNumber(id) {
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
    setThreadAuthor('');
    setThreadSubject('');
    setThreadContent('');
    setFile(null);
    enableForm();
    await readDatabase();
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
