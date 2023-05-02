import React from 'react';

export default function Post({
  author,
  content,
  image,
  number,
  replies,
  subject,
  time,
}) {
  return (
    <article id={number}>
      <span>
        {subject ? <span aria-label="subject">{subject}</span> : null}
        <span aria-label="author">
          {author !== undefined ? author : 'Anonymous'}
        </span>
        <span aria-label="timestamp">{new Date(time).toLocaleString()}</span>
        <span aria-label="post number">{number}</span>
        {replies.length === 0
          ? null
          : replies.map((reply) => (
            <a key={`${number}-${reply}`} href={`#${reply}`}>
              {reply}
            </a>
          ))}
      </span>
      {image ? <img src={image} alt="" /> : null}
      <span aria-label="post content">{content}</span>
    </article>
  );
}
