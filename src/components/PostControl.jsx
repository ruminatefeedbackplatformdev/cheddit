import React from 'react';
import {
  arrayRemove, deleteField, doc, updateDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import database from '../util/firestore';

export default function PostControl({ board, number, thread }) {
  const navigate = useNavigate();

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
    navigate(`/${board}`);
  };

  if (number === thread) {
    return (
      <button className="delete-post" onClick={deleteThread} type="button">
        DELETE THREAD
      </button>
    );
  }
  return (
    <button className="delete-post" onClick={deletePost} type="button">
      DELETE POST
    </button>
  );
}
