import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserPosts({ boards, user }) {
  const [posts, setPosts] = useState({});

  useEffect(() => {
    // look through all posts in all boards to find user's posts
    const usersPosts = {};
    boards.forEach((board) => {
      const postIDs = Object.keys(board.posts);
      postIDs.forEach((post) => {
        if (board.posts[post].authorID === user.uid) {
          if (!Object.keys(usersPosts).includes(board.id)) {
            usersPosts[board.id] = [];
          }
          // we already show user their threads - no need to include them here
          if (+post !== +board.posts[post].thread) {
            const thisPost = {};
            thisPost.content = board.posts[post].content;
            thisPost.number = post;
            thisPost.thread = board.posts[post].thread;
            usersPosts[board.id].push(thisPost);
          }
        }
      });
    });
    setPosts(usersPosts);
  }, [boards]);

  const boardsWithPosts = Object.keys(posts);

  const shortenPostContent = (content) => {
    if (content.length < 11) {
      return content;
    }
    return `${content.slice(0, 10)}...`;
  };

  return (
    <div>
      <h1>Your Posts</h1>
      <div className="user-posts">
        {boardsWithPosts.map((board) => posts[board].map((post) => (
          <Link
            key={`${board}_t${post.thread}#${post.number}`}
            to={`/${board}_t${post.thread}#${post.number}`}
          >
            {`/${board}/ - #${post.number} (${shortenPostContent(post.content)})`}
          </Link>
        )))}
      </div>
    </div>
  );
}
