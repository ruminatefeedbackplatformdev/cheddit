import React, { useState } from 'react';
import {
  arrayRemove,
  deleteField,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import database from '../util/firestore';

export default function PostControl({
  board, number, setUser, thread, user,
}) {
  const navigate = useNavigate();

  const [confirming, setConfirming] = useState(false);

  const cancelDelete = () => {
    setConfirming(false);
  };

  const promptConfirm = async () => {
    setConfirming(true);
  };

  const deletePost = async () => {
    // just need to delete this one post
    const boardRef = doc(database, 'boards', board);
    await updateDoc(boardRef, {
      [`posts.${number}`]: deleteField(),
    });
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

  const updateUserThreads = async () => {
    // remove the thread from user's local state
    const prevThreads = { ...user.threads };
    if (Object.keys(user.threads).length) {
      Object.keys(user.threads).forEach((threadBoard) => {
        prevThreads[threadBoard] = [...user.threads[threadBoard]];
      });
      const index = prevThreads[board].indexOf(thread);
      prevThreads[board].splice(index, 1);
      if (prevThreads[board].length === 0) {
        delete prevThreads[board];
      }
    }
    setUser({
      ...user,
      threads: prevThreads,
    });

    // then remove from the database
    const userRef = doc(database, 'users', user.uid);
    setDoc(userRef, { threads: prevThreads }, { merge: true });
  };

  const deleteThread = async () => {
    const boardRef = doc(database, 'boards', board);

    // delete all posts within a thread
    const allPosts = await getAllThreadPosts();
    allPosts.forEach(async (post) => {
      await updateDoc(boardRef, {
        [`posts.${post}`]: deleteField(),
      });
    });

    // then delete the thread itself
    await updateDoc(boardRef, {
      threads: arrayRemove(thread),
    });

    await updateUserThreads();
    setConfirming(false);
    navigate(`/${board}`);
  };

  if (number === thread) {
    return (
      <span className="post-control">
        <button
          className={confirming ? 'delete-post hidden' : 'delete-post visible'}
          onClick={promptConfirm}
          type="button"
        >
          DELETE THREAD
        </button>
        <span className={confirming ? 'confirm visible' : 'confirm hidden'}>
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
        </span>
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
      <span className={confirming ? 'confirm visible' : 'confirm hidden'}>
        <button className="delete-confirm" onClick={deletePost} type="button">
          CONFIRM DELETE
        </button>
        <button className="delete-confirm" onClick={cancelDelete} type="button">
          CANCEL
        </button>
        <span>Are you sure? Posts cannot be recovered once deleted!</span>
      </span>
    </span>
  );
}
