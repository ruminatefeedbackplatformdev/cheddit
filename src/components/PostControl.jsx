import React, { useState } from 'react';
import {
  arrayRemove, deleteField, doc, updateDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import database from '../util/firestore';

export default function PostControl({ board, number, thread }) {
  const navigate = useNavigate();

  const [confirming, setConfirming] = useState(false);

  const cancelDelete = () => {
    setConfirming(false);
  };

  const promptConfirm = async () => {
    setConfirming(true);
  };

  const deletePost = async () => {
    const boardRef = doc(database, 'boards', board);
    await updateDoc(boardRef, {
      [`posts.${number}`]: deleteField(),
    });
  };

  const deleteThread = async () => {
    const boardRef = doc(database, 'boards', board);
    await updateDoc(boardRef, {
      [`posts.${number}`]: deleteField(),
    });
    await updateDoc(boardRef, {
      threads: arrayRemove(thread),
    });
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
