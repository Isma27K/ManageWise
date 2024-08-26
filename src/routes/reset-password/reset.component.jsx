import React, { useState } from 'react';
import { auth } from '../../utils/firebase/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Check your email for the password reset link.');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handlePasswordReset}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
