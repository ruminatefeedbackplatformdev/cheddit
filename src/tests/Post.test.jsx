import React from 'react';
import { act, render, screen } from '@testing-library/react';
// eslint-disable-next-line
import { toHaveAttribute } from "@testing-library/jest-dom";
import Post from '../components/Post';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getFirestore: jest.fn(),
  getDoc: () => ({
    data: () => ({
      posts: {
        1: {
          author: 'John Doe',
          board: 'a',
          content: 'Hello world!',
          image: null,
          replies: [],
          subject: 'Greetings',
          thread: 1,
          time: 1683232046656,
        },
        2: {
          author: null,
          board: 'a',
          content: 'More content',
          image: null,
          replies: [],
          subject: null,
          thread: 1,
          time: 1683232546656,
        },
      },
      threads: [1],
    }),
  }),
}));

describe('Post component', () => {
  it('exists', async () => {
    await act(async () => {
      render(<Post replies={[]} />);
    });
    expect(screen.getByRole('article')).toBeTruthy();
  });

  it('handles lack of image', async () => {
    await act(async () => {
      render(<Post replies={[]} image={null} />);
    });
    expect(screen.queryByRole('img')).toBeFalsy();
  });

  it('displays image if provided', async () => {
    await act(async () => {
      render(<Post replies={[]} image="path-to-image" />);
    });
    expect(screen.getByRole('img')).toBeTruthy();
  });

  it('links to correct image source', async () => {
    await act(async () => {
      render(<Post replies={[]} image="path-to-image" />);
    });
    expect(screen.getByRole('img')).toHaveAttribute('src', 'path-to-image');
  });

  it('handles lack of subject', async () => {
    await act(async () => {
      render(<Post replies={[]} subject={null} />);
    });
    expect(screen.queryByRole('generic', { name: 'subject' })).toBeFalsy();
  });

  it('displays subject if provided', async () => {
    await act(async () => {
      render(<Post replies={[]} subject="first post in thread" />);
    });
    expect(screen.getByRole('generic', { name: 'subject' }).textContent).toBe(
      'first post in thread',
    );
  });

  it('displays anonymous author if none provided', async () => {
    await act(async () => {
      render(<Post replies={[]} />);
    });
    expect(screen.getByRole('generic', { name: 'author' }).textContent).toBe(
      'Anonymous',
    );
  });

  it('displays name of authenticated author', async () => {
    await act(async () => {
      render(<Post replies={[]} author="Dude McGuy" />);
    });
    expect(screen.getByRole('generic', { name: 'author' }).textContent).toBe(
      'Dude McGuy',
    );
  });

  it('displays timestamp', async () => {
    await act(async () => {
      render(<Post replies={[]} time={1683055751230} />);
    });
    expect(screen.getByRole('generic', { name: 'timestamp' }).textContent).toBe(
      '5/2/2023, 12:29:11 PM',
    );
  });

  it('displays post number', async () => {
    await act(async () => {
      render(<Post replies={[]} number={254} />);
    });
    expect(
      screen.getByRole('generic', { name: 'post number' }).textContent,
    ).toBe('#254');
  });

  it('displays correct number of replies', async () => {
    const replies = [123, 234, 345];
    await act(async () => {
      render(<Post replies={replies} />);
    });
    expect(screen.getAllByRole('link').length).toBe(3);
  });

  it('displays post content', async () => {
    await act(async () => {
      render(<Post replies={[]} content="Here is the post content" />);
    });
    expect(
      screen.getByRole('generic', { name: 'post content' }).textContent,
    ).toBe('Here is the post content');
  });
});
