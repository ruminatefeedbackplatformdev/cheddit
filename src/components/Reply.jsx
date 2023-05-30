import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const lastPost = Object.keys(board.posts);
  return +lastPost[lastPost.length - 1] + 1;
}

export default function Reply({
  board,
  enabled,
  postContent,
  readDatabase,
  setEnabled,
  setPostContent,
  thread,
  user,
}) {
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postAuthor, setPostAuthor] = useState('');
  const [validComment, setValidComment] = useState(false);
  const [validFile, setValidFile] = useState(false);

  useEffect(() => {
    if (user) {
      setPostAuthor(user.displayName);
    } else {
      setPostAuthor('');
    }
  }, [user]);

  useEffect(() => {
    const permittedTypes = [
      'image/gif',
      'image/jpeg',
      'image/png',
    ];

    if (postContent === '' && !file) {
      setError('no blank post - need image or text');
      setValidFile(false);
      setValidComment(false);
    }
    if (postContent !== '' && !file) {
      setError(null);
      setValidComment(true);
      setValidFile(true);
    }
    if (postContent === '' && file) {
      setError(null);
      setValidComment(true);
      setValidFile(true);
    }
    if (file && file.size > 4000000) {
      setError('image too large (4MB limit)');
      setValidComment(true);
      setValidFile(false);
    }
    if (file && !permittedTypes.includes(file.type)) {
      setError('unsupported file type (only jpg, gif or png)');
      setValidComment(true);
      setValidFile(false);
    }
  }, [file, postContent]);

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

  const resetForm = () => {
    if (user) {
      setPostAuthor(user.displayName);
    } else {
      setPostAuthor('');
    }
    setPostContent('');
    setFile(null);
    setValidComment(false);
    setValidFile(false);
    setError(null);
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

  const handlePostLinks = async (newPostNumber) => {
    // parse the new post content for ">>" links
    const lines = postContent.split('\n');
    await lines.forEach(async (line) => {
      const postLink = /^>>\d+$/;
      if (line.match(postLink)) {
        // update the linked post in the database
        const linked = +line.slice(2);
        const boardRef = doc(database, 'boards', board);
        const repliesToUpdate = `posts.${linked}.replies`;
        await updateDoc(boardRef, {
          [repliesToUpdate]: arrayUnion(newPostNumber),
        });
      }
    });
  };

  const submitPost = async () => {
    try {
      // display the "uploading" message
      setLoading(true);

      const newPost = {
        author: postAuthor === '' ? null : postAuthor,
        authorID: user ? user.uid : null,
        content: postContent,
        image: null,
        replies: [],
        subject: null,
        storagePath: null,
        thread,
        thumb: null,
        time: Date.now(),
      };

      // we're updating nested fields in firestore
      const newPostNumber = await getNewPostNumber(board);
      const update = {};
      const updateKey = `posts.${newPostNumber}`;
      update[updateKey] = newPost;

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

      // update database to handle any links to other posts
      await handlePostLinks(newPostNumber);

      // hide "uploading" message
      setLoading(false);

      // reset the form
      resetForm();

      // this will update the posts for the parent thread
      await readDatabase();
    } catch (err) {
      console.error(`Error submitting post: ${err}`);
      const { code } = { ...err };
      setError(code);
    }
  };

  if (enabled) {
    return (
      <div className="reply-container">
        <form aria-label="reply form" className="reply-form">
          <label htmlFor="post-author">
            Name:
            {user ? (
              <span>{postAuthor}</span>
            ) : (
              <input
                id="post-author"
                name="post-author"
                onChange={changeAuthor}
                type="text"
                placeholder="Anonymous"
                value={postAuthor}
              />
            )}
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
          <span className="error" hidden={!error}>
            {error}
          </span>
          <div className={loading ? 'buttons hidden' : 'buttons visible'}>
            <button onClick={resetForm} type="button">
              CANCEL
            </button>
            <button
              disabled={error || !validComment || !validFile}
              onClick={submitPost}
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
        <Link to={`/${board}`}>{`Back to /${board}/`}</Link>
      </div>
    );
  }

  return (
    <div className="reply-container">
      <button onClick={enableForm} type="button">
        Post a Reply
      </button>
      <Link to={`/${board}`}>{`Back to /${board}/`}</Link>
    </div>
  );
}
