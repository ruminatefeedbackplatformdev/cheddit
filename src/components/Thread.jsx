import React from 'react';
import Post from './Post';

export default function Thread({ posts }) {
  return (
    <div aria-label="thread">
      {posts.map((post) => (
        <Post
          author={post.author}
          content={post.content}
          image={post.image}
          number={post.number}
          key={post.number}
          replies={post.replies}
          subject={post.subject}
          time={post.time}
        />
      ))}
    </div>
  );
}
