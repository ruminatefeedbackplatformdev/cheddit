import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  act, render, screen, waitFor,
} from '@testing-library/react';
// eslint-disable-next-line
import { toBeInTheDocument } from "@testing-library/jest-dom";
import Board from '../components/Board';

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
          time: 1683232046656,
        },
        2: {
          author: undefined,
          content: 'More content',
          image: undefined,
          replies: [],
          subject: undefined,
          time: 1683232546656,
        },
      },
      threads: [1, 2],
    }),
  }),
}));

describe('Board component', () => {
  it('exists', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Board id="123" />
        </BrowserRouter>,
      );
    });
    expect(screen.getByRole('main')).toBeTruthy();
  });

  it('loads thread OPs from database', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Board id="123" />
        </BrowserRouter>,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Hello world!')).toBeInTheDocument();
      expect(screen.getByText('Greetings')).toBeInTheDocument();
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('5/4/2023, 1:27:26 PM')).toBeInTheDocument();
    });
  });

  it('shows correct number of threads', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Board id="123" />
        </BrowserRouter>,
      );
    });
    expect(screen.getAllByRole('article').length).toBe(2);
  });
});
