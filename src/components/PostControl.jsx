import React, { useState } from 'react';
import {
  arrayRemove,
  deleteField,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
// eslint-disable-next-line
import { deleteObject, getStorage, ref } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import database from '../util/firestore';

export default function PostControl({
  board,
  isSticky,
  number,
  thread,
}) {
  const navigate = useNavigate();

  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);

  const cancelDelete = () => {
    setConfirming(false);
    setError(null);
  };

  const promptConfirm = async () => {
    setConfirming(true);
  };

  const deletePostLinks = async (postNumber) => {
    // need to remove this post number from any posts linking to it
    const boardRef = doc(database, 'boards', board);
    const boardSnap = await getDoc(boardRef);
    const { posts } = boardSnap.data();
    const allPostNumbers = Object.keys(posts);
    allPostNumbers.forEach(async (post) => {
      const thisPost = posts[post];
      if (thisPost.replies.includes(postNumber)) {
        // delete it from the posts replies
        const postToUpdate = `posts.${post}.replies`;
        await updateDoc(boardRef, {
          [postToUpdate]: arrayRemove(postNumber),
        });
      }
    });
  };

  const deleteImage = async (postNumber) => {
    // find the post in the database
    const boardRef = doc(database, 'boards', board);
    const boardSnap = await getDoc(boardRef);
    const { posts } = boardSnap.data();

    // if the post has an image, storagePath won't be null
    const imagePath = posts[postNumber].storagePath;
    if (imagePath) {
      const storage = getStorage();
      const imageRef = ref(storage, imagePath);
      const thumbRef = ref(storage, `${board}/${postNumber}-thm.JPEG`);
      // delete the image and it's thumbnail
      await deleteObject(imageRef);
      await deleteObject(thumbRef);
    }
  };

  const deletePost = async () => {
    try {
      // just need to delete this one post
      const boardRef = doc(database, 'boards', board);
      await deleteImage(number);
      await updateDoc(boardRef, {
        [`posts.${number}`]: deleteField(),
      });
      await deletePostLinks(number);
      setError(null);
    } catch (err) {
      console.error(err);
      const { code } = { ...err };
      setError(code);
    }
  };

  const getAllThreadPosts = async () => {
    // figure out which posts belong to the thread being deleted
    const boardRef = doc(database, 'boards', board);
    const boardSnap = await getDoc(boardRef);

    const { posts } = boardSnap.data();
    const allThreadPosts = [];
    Object.keys(posts).forEach((post) => {
      if (posts[post].thread === thread) {
        allThreadPosts.push(post);
      }
    });
    return allThreadPosts;
  };

  const deleteThread = async () => {
    try {
      const boardRef = doc(database, 'boards', board);

      // delete all posts within a thread
      const allPosts = await getAllThreadPosts();
      allPosts.forEach(async (post) => {
        await deleteImage(post);
        await updateDoc(boardRef, {
          [`posts.${post}`]: deleteField(),
        });
        await deletePostLinks(post);
      });

      // then delete the thread itself
      await updateDoc(boardRef, {
        threads: arrayRemove(thread),
      });

      setConfirming(false);
      setError(null);
      navigate(`/${board}`);
    } catch (err) {
      console.error(err);
      const { code } = { ...err };
      setError(code);
    }
  };

  const makeSticky = async () => {
    try {
      // will keep the thread at the top of the board
      const boardRef = doc(database, 'boards', board);
      await updateDoc(boardRef, {
        [`posts.${number}.isSticky`]: true,
      });
    } catch (err) {
      console.error(err);
      const { code } = { ...err };
      setError(code);
    }
  };

  const unStick = async () => {
    try {
      // go back to normal thread sorting
      const boardRef = doc(database, 'boards', board);
      await updateDoc(boardRef, {
        [`posts.${number}.isSticky`]: false,
      });
    } catch (err) {
      console.error(err);
      const { code } = { ...err };
      setError(code);
    }
  };

  if (number === thread) {
    return (
      <span className="post-control">
        {isSticky ? (
          <button onClick={unStick} type="button">
            Unstick
          </button>
        ) : (
          <button onClick={makeSticky} type="button">
            Make Sticky
          </button>
        )}
        <button
          className={confirming ? 'delete-post hidden' : 'delete-post visible'}
          onClick={promptConfirm}
          type="button"
        >
          DELETE THREAD
        </button>
        <div className={confirming ? 'confirm visible' : 'confirm hidden'}>
          <span className="error" hidden={!error}>{error}</span>
          <button
            className="delete-confirm"
            onClick={deleteThread}
            type="button"
          >
            CONFIRM DELETE
          </button>
          <button
            className="delete-confirm"
            onClick={cancelDelete}
            type="button"
          >
            CANCEL
          </button>
          <span>
            Are you sure? Threads and their posts cannot be recovered once
            deleted!
          </span>
        </div>
      </span>
    );
  }
  return (
    <span className="post-control">
      <button
        className={confirming ? 'delete-post hidden' : 'delete-post visible'}
        onClick={promptConfirm}
        type="button"
      >
        DELETE POST
      </button>
      <div className={confirming ? 'confirm visible' : 'confirm hidden'}>
        <span className="error" hidden={!error}>{error}</span>
        <button className="delete-confirm" onClick={deletePost} type="button">
          CONFIRM DELETE
        </button>
        <button className="delete-confirm" onClick={cancelDelete} type="button">
          CANCEL
        </button>
        <span>Are you sure? Posts cannot be recovered once deleted!</span>
      </div>
    </span>
  );
}
