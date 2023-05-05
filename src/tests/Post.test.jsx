import React from 'react';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line
import { toHaveAttribute } from "@testing-library/jest-dom";
import Post from '../components/Post';

describe('Post component', () => {
  it('exists', () => {
    render(<Post replies={[]} />);
    expect(screen.getByRole('article')).toBeTruthy();
  });

  it('handles lack of image', () => {
    render(<Post replies={[]} image={null} />);
    expect(screen.queryByRole('img')).toBeFalsy();
  });

  it('displays image if provided', () => {
    render(<Post replies={[]} image="path-to-image" />);
    expect(screen.getByRole('img')).toBeTruthy();
  });

  it('links to correct image source', () => {
    render(<Post replies={[]} image="path-to-image" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'path-to-image');
  });

  it('handles lack of subject', () => {
    render(<Post replies={[]} subject={null} />);
    expect(screen.queryByRole('generic', { name: 'subject' })).toBeFalsy();
  });

  it('displays subject if provided', () => {
    render(<Post replies={[]} subject="first post in thread" />);
    expect(screen.getByRole('generic', { name: 'subject' }).textContent).toBe(
      'first post in thread',
    );
  });

  it('displays anonymous author if none provided', () => {
    render(<Post replies={[]} />);
    expect(screen.getByRole('generic', { name: 'author' }).textContent).toBe(
      'Anonymous',
    );
  });

  it('displays name of authenticated author', () => {
    render(<Post replies={[]} author="Dude McGuy" />);
    expect(screen.getByRole('generic', { name: 'author' }).textContent).toBe(
      'Dude McGuy',
    );
  });

  it('displays timestamp', () => {
    render(<Post replies={[]} time={1683055751230} />);
    expect(screen.getByRole('generic', { name: 'timestamp' }).textContent).toBe(
      '5/2/2023, 12:29:11 PM',
    );
  });

  it('displays post number', () => {
    render(<Post replies={[]} number={254} />);
    expect(
      screen.getByRole('generic', { name: 'post number' }).textContent,
    ).toBe('#254');
  });

  it('displays correct number of replies', () => {
    const replies = [123, 234, 345];
    render(<Post replies={replies} />);
    expect(screen.getAllByRole('link').length).toBe(3);
  });

  it('displays post content', () => {
    render(<Post replies={[]} content="Here is the post content" />);
    expect(
      screen.getByRole('generic', { name: 'post content' }).textContent,
    ).toBe('Here is the post content');
  });
});
