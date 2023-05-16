import React from 'react';

export default function PostControl({ board, number }) {
  console.log(board, number);
  return (
    <button className="delete-post" type="button">
      DELETE POST
    </button>
  );
}
