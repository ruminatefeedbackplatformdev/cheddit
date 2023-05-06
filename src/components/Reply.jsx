import React, { useState } from 'react';

export default function Reply() {
  const [enabled, setEnabled] = useState(false);
  const [postAuthor, setPostAuthor] = useState('');
  const [postContent, setPostContent] = useState('');

  const changeAuthor = (event) => {
    setPostAuthor(event.target.value);
  };

  const changeContent = (event) => {
    setPostContent(event.target.value);
  };

  const enableForm = () => {
    setEnabled(!enabled);
  };

  const submitPost = () => {
    // XXX
    // do something
  };

  if (enabled) {
    return (
      <form aria-label="reply form">
        <label htmlFor="post-author">
          Name:
          <input
            id="post-author"
            name="post-author"
            onChange={changeAuthor}
            type="text"
            placeholder="Anonymous"
            value={postAuthor}
          />
        </label>
        <label htmlFor="post-content">
          Comment:
          <textarea
            id="post-content"
            name="post-content"
            onChange={changeContent}
            value={postContent}
          />
        </label>
        <label htmlFor="post-image">
          Image:
          <input
            accept="image/jpeg, image/gif, image/png"
            id="post-image"
            name="post=image"
            type="file"
          />
        </label>
        <button onClick={enableForm} type="button">CANCEL</button>
        <button onClick={submitPost} type="button">POST</button>
      </form>
    );
  }

  return (
    <div>
      <button onClick={enableForm} type="button">
        [ Post a Reply ]
      </button>
    </div>
  );
}
