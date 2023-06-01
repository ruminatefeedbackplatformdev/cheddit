import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewThread from '../components/NewThread';

describe('NewThread component', () => {
  it('exists', () => {
    render(
      <BrowserRouter>
        <NewThread />
      </BrowserRouter>,
    );
    expect(screen.getByRole('button', { name: 'Start a Thread' })).toBeTruthy();
  });

  it('displays thread form when button clicked', () => {
    render(
      <BrowserRouter>
        <NewThread />
      </BrowserRouter>,
    );
    act(() => {
      userEvent.click(screen.getByRole('button', { name: 'Start a Thread' }));
    });
    expect(screen.getByRole('form', { name: 'thread form' })).toBeTruthy();
  });

  it('displays correct input fields', () => {
    render(
      <BrowserRouter>
        <NewThread />
      </BrowserRouter>,
    );
    act(() => {
      userEvent.click(screen.getByRole('button', { name: 'Start a Thread' }));
    });
    expect(screen.getByLabelText('Subject:')).toBeTruthy();
    expect(screen.getByLabelText('Comment:')).toBeTruthy();
    expect(screen.getByLabelText('Image:')).toBeTruthy();
  });
});
