import React from 'react';
import { render, screen } from '@testing-library/react';
import Thread from '../components/Thread';

describe('Thread component', () => {
  const posts = [
    {
      number: 1,
      content: 'test post content',
      image: '#',
      replies: [7],
      subject: 'test subject',
      time: 1683055000000,
    },
    {
      number: 7,
      content: 'some more content here',
      image: null,
      replies: [],
      time: 1683055751230,
    },
  ];

  it('exists', () => {
    render(<Thread posts={posts} />);
    expect(screen.getByRole('generic', { name: 'thread' })).toBeTruthy();
  });

  it('displays correct number of posts', () => {
    render(<Thread posts={posts} />);
    expect(screen.getAllByRole('article').length).toBe(2);
  });
});
