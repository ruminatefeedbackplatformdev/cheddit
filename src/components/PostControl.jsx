import React from 'react';
import { deleteField, doc, updateDoc } from 'firebase/firestore';
import database from '../util/firestore';

export default function PostControl({ board, number, thread }) {
  const deletePost = async () => {
    const boardRef = doc(database, 'boards', board);
    await updateDoc(boardRef, {
      [`posts.${number}`]: deleteField(),
    });
  };

  const deleteThread = () => {
    console.log(`deleting thread ${board} #${thread}`);
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
