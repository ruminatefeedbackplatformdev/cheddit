import React from 'react';
import {
  act, render, screen, waitFor,
} from '@testing-library/react';
// eslint-disable-next-line
import { toBeInTheDocument } from '@testing-library/jest-dom';
import Thread from '../components/Thread';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getFirestore: jest.fn(),
  getDoc: () => ({
    data: () => ({
      posts: {
        1: {
          author: 'John Doe',
          content: 'Hello world!',
          image: undefined,
          replies: [],
          subject: 'Greetings',
          thread: 1,
          time: 1683232046656,
        },
        2: {
          author: undefined,
          content: 'More content',
          image: undefined,
          replies: [],
          subject: undefined,
          thread: 1,
          time: 1683232546656,
        },
      },
      threads: [1],
    }),
  }),
}));

describe('Thread component', () => {
  it('exists', async () => {
    await act(async () => {
      render(<Thread board="123" op={1} />);
    });
    expect(screen.getByRole('generic', { name: 'thread' })).toBeTruthy();
  });

  it('loads posts from database', async () => {
    await act(async () => {
      render(<Thread board="123" op={1} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Hello world!')).toBeInTheDocument();
      expect(screen.getByText('More content')).toBeInTheDocument();
    });
  });

  it('shows correct number of boards', async () => {
    await act(async () => {
      render(<Thread board="123" op={1} />);
    });
    expect(screen.getAllByRole('article').length).toBe(2);
  });
});
