import React from 'react';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
} from 'firebase/auth';

export default function Login() {
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);
  };

  return (
    <div>
      <button type="button" onClick={googleLogin}>
        LOGIN WITH GOOGLE
      </button>
    </div>
  );
}
