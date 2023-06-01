import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  arrayUnion, doc, getDoc, updateDoc,
} from 'firebase/firestore';
import {
  getDownloadURL, getStorage, ref, uploadBytes,
} from 'firebase/storage';
import Resizer from 'react-image-file-resizer';
import database from '../util/firestore';
import hourglass from '../images/loading.gif';

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

export default function NewThread({
  board, readDatabase, user,
}) {
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [threadAuthor, setThreadAuthor] = useState('');
  const [threadSubject, setThreadSubject] = useState('');
  const [threadContent, setThreadContent] = useState('');
  const [validContent, setValidContent] = useState(false);
  const [validFile, setValidFile] = useState(false);

  useEffect(() => {
    if (user) {
      setThreadAuthor(user.displayName);
    } else {
      setThreadAuthor('');
    }
  }, [user]);

  useEffect(() => {
    const permittedTypes = [
      'image/gif',
      'image/jpeg',
      'image/png',
    ];

    if (threadContent === '' && !file) {
      setError('no blank thread - need image and text');
      setValidFile(false);
      setValidContent(false);
    }
    if (threadContent !== '' && !file) {
      setError('no thread without image');
      setValidContent(true);
      setValidFile(false);
    }
    if (threadContent === '' && file) {
      setError('no thread without text');
      setValidContent(false);
      setValidFile(true);
    }
    if (threadContent !== '' && file) {
      setError(null);
      setValidContent(true);
      setValidFile(true);
    }
    if (file && file.size > 4000000) {
      setError('image too large (4MB limit)');
      setValidContent(true);
      setValidFile(false);
    }
    if (file && !permittedTypes.includes(file.type)) {
      setError('unsupported file type (only jpg, gif or png)');
      setValidContent(true);
      setValidFile(false);
    }
  }, [threadContent, file]);

  const navigate = useNavigate();

  const enableForm = () => {
    setEnabled(!enabled);
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

  const resetForm = () => {
    if (user) {
      setThreadAuthor(user.displayName);
    } else {
      setThreadAuthor('');
    }
    setThreadSubject('');
    setThreadContent('');
    setValidContent(false);
    setValidFile(false);
    setError(null);
    setFile(null);
    enableForm();
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
    } catch (err) {
      console.error(`Error uploading file: ${err}`);
      const { code } = { ...err };
      setError(code);
    }
    return downloadURL;
  };

  const resizeFile = (bigFile) => new Promise((resolve) => {
    Resizer.imageFileResizer(
      bigFile,
      200,
      200,
      'JPEG',
      50,
      0,
      (uri) => {
        resolve(uri);
      },
      'file',
    );
  });

  const uploadThumbnail = async (newPostNumber) => {
    const storage = getStorage();
    const extension = '.JPEG';
    // don't preserve the original file names - images are referred to
    // by their respective post's number
    const imageRef = ref(storage, `${board}/${newPostNumber}-thm${extension}`);
    let downloadURL = null;
    try {
      const resized = await resizeFile(file);
      const snapshot = await uploadBytes(imageRef, resized);
      downloadURL = await getDownloadURL(snapshot.ref);
    } catch (err) {
      console.error(`Error uploading thumbnail: ${err}`);
      const { code } = { ...err };
      setError(code);
    }
    return downloadURL;
  };

  const submitThread = async () => {
    // display the "uploading" message
    try {
      setLoading(true);

      const newPost = {
        author: threadAuthor === '' ? null : threadAuthor,
        authorID: user ? user.uid : null,
        content: threadContent,
        image: null,
        replies: [],
        storagePath: null,
        subject: threadSubject,
        thread: null,
        thumb: null,
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
        const thumbURL = await uploadThumbnail(newPostNumber);
        update[updateKey].image = URL;
        update[updateKey].thumb = thumbURL;

        const extension = file.name.match(/\.[a-zA-Z0-9]+$/).join();
        update[updateKey].storagePath = `${board}/${newPostNumber}${extension}`;
      }

      const boardRef = doc(database, 'boards', board);
      await updateDoc(boardRef, update);
      await updateDoc(boardRef, {
        threads: arrayUnion(newPostNumber),
      });

      // hide "uploading" message
      setLoading(false);

      // reset the form
      resetForm();

      // this will update the threads for the parent board
      await readDatabase();

      // take the user to the thread they just created
      navigate(`/${board}_t${newPostNumber}`);
    } catch (err) {
      console.error(`Error submitting thread: ${err}`);
      const { code } = { ...err };
      setLoading(false);
      setError(code);
    }
  };

  if (enabled) {
    return (
      <div className="new-thread-container">
        <form aria-label="thread form" className="thread-form">
          <label htmlFor="thread-author">
            Name:
            {user ? (
              <span id="thread-author">{threadAuthor}</span>
            ) : (
              <span id="thread-author">Anonymous</span>
            )}
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
          <span className="error" hidden={!error}>
            {error}
          </span>
          <div className={loading ? 'buttons hidden' : 'buttons visible'}>
            <button onClick={resetForm} type="button">
              CANCEL
            </button>
            <button
              disabled={error || !validContent || !validFile}
              onClick={submitThread}
              type="button"
            >
              POST
            </button>
          </div>
          <div className={loading ? 'loading visible' : 'loading hidden'}>
            <span>Uploading...</span>
            <img src={hourglass} alt="" />
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="new-thread-container">
      <button onClick={enableForm} type="button">
        Start a Thread
      </button>
    </div>
  );
}
