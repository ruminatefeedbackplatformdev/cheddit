import React from 'react';
import { Link } from 'react-router-dom';

export default function None() {
  return (
    <div>
      Nothing to see here...perhaps you&apos;ve visited a bad link or entered an
      invalid URL? Try heading back
      {' '}
      <Link to="/">home</Link>
      .
    </div>
  );
}
