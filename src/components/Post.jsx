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
  const splitContent = content.split('\\n');
  console.log(splitContent);
  return (
    <article className="post" id={number}>
      <span className="post-info">
        {subject ? <span aria-label="subject">{subject}</span> : null}
        <span aria-label="author">{author || 'Anonymous'}</span>
        <span aria-label="timestamp">{new Date(time).toLocaleString()}</span>
        <span aria-label="post number">{`#${number}`}</span>
        {replies.length === 0
          ? null
          : replies.map((reply) => (
            <a key={`${number}-${reply}`} href={`#${reply}`}>
              {reply}
            </a>
          ))}
      </span>
      <span>
        {image ? <img src={image} alt="" /> : null}
        <span aria-label="post content">
          {content.split('\\n').map((line, index) => (
            // post content comes from a <textarea> which can contain
            // newline "\n" characters as part of the string stored in
            // the cloud firestore database.

            // seem safe to use the index as part of the key here, since
            // we're also using the unique post number.

            // eslint-disable-next-line
            <span key={`#${number}-line${index}`}>{line}</span>
          ))}
        </span>
      </span>
    </article>
  );
}
