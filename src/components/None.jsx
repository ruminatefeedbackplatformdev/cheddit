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
      <h1>Invalid Route</h1>
      <div>
        {loading ? (
          <div className="loading">
            Loading...
            <img src={hourglass} alt="" />
          </div>
        ) : (
          <div className="invalid-message">
            <div>
              Nothing to see here... perhaps you&apos;ve visited a bad link or
              entered an invalid URL?
            </div>
            <div>
              Try heading back
              {' '}
              <Link to="/">home</Link>
              .
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
