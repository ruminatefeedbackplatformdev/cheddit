import React from 'react';
import { BrowserRouter } from 'react-router-dom';
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
          image: null,
          replies: [],
          subject: 'Greetings',
          thread: 1,
          time: 1683232046656,
        },
        2: {
          author: null,
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
  onSnapshot: jest.fn(),
}));

describe('Thread component', () => {
  it('exists', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Thread board="123" op={1} />
        </BrowserRouter>,
      );
    });
    expect(screen.getByRole('generic', { name: 'thread' })).toBeTruthy();
  });

  it('loads posts from database', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Thread board="123" op={1} />
        </BrowserRouter>,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Hello world!')).toBeInTheDocument();
      expect(screen.getByText('More content')).toBeInTheDocument();
    });
  });

  it('shows correct number of posts', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Thread board="123" op={1} />
        </BrowserRouter>,
      );
    });
    expect(screen.getAllByRole('article').length).toBe(2);
  });
});
