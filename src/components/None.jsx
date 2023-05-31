import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import hourglass from '../images/loading.gif';

export default function None() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="invalid-route">
      {loading ? (
        <span className="loading">
          Loading...
          <img src={hourglass} alt="" />
        </span>
      ) : (
        <span>
          Nothing to see here...perhaps you&apos;ve visited a bad link or
          entered an invalid URL? Try heading back
          {' '}
          <Link to="/">home</Link>
          .
        </span>
      )}
    </div>
  );
}
