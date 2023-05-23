import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  arrayUnion, doc, getDoc, setDoc, updateDoc,
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
  board, readDatabase, setUser, user,
}) {
  const [enabled, setEnabled] = useState(false);
  const [threadAuthor, setThreadAuthor] = useState('');
  const [threadSubject, setThreadSubject] = useState('');
  const [threadContent, setThreadContent] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setThreadAuthor(user.displayName);
    } else {
      setThreadAuthor('');
    }
  }, [user]);

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

  const resetForm = () => {
    if (user) {
      setThreadAuthor(user.displayName);
    } else {
      setThreadAuthor('');
    }
    setThreadSubject('');
    setThreadContent('');
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
    } catch (error) {
      // TODO - need to handle this better
      console.error(`Error uploading file: ${error}`);
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
    } catch (error) {
      // TODO - need to handle this better
      console.error(`Error uploading thumbnail: ${error}`);
    }
    return downloadURL;
  };

  const updateUserThreads = async (newPostNumber) => {
    // add the new thread to the user's local state
    const prevThreads = {};
    Object.keys(user.threads).forEach((threadBoard) => {
      prevThreads[threadBoard] = [...user.threads[threadBoard]];
    });
    if (Object.hasOwn(prevThreads, board)) {
      prevThreads[board].push(newPostNumber);
    } else {
      prevThreads[board] = [newPostNumber];
    }
    setUser(
      {
        ...user,
        threads: prevThreads,
      },
    );

    // then update the database accordingly
    const userRef = doc(database, 'users', user.uid);
    setDoc(userRef, { threads: prevThreads }, { merge: true });
  };

  const submitThread = async () => {
    // display the "uploading" message
    setLoading(true);

    const newPost = {
      author: threadAuthor === '' ? null : threadAuthor,
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

    // keep track of user's threads
    if (user) {
      updateUserThreads(newPostNumber);
    }

    // hide "uploading" message
    setLoading(false);

    // reset the form
    resetForm();

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
          <div className={loading ? 'buttons hidden' : 'buttons visible'}>
            <button onClick={resetForm} type="button">
              CANCEL
            </button>
            <button onClick={submitThread} type="button">
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
    <div>
      <button onClick={enableForm} type="button">
        Start a Thread
      </button>
    </div>
  );
}
