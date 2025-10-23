import React, { useState } from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!username.trim() || !password) {
      setError('Both username and password are required.');
      return;
    }

    setError('');
    const payload = { username: username.trim(), password };

    // Log to browser console (as required)
    console.log('Login submit:', payload);

    // Optional: show short confirmation (not required)
    // alert('Submitted — open console to see payload');

    // Optionally clear the fields:
    // setUsername('');
    // setPassword('');
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Experiment-8: Login Form</h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
        <label style={{ display: 'block' }}>
          <div>Username</div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            style={{ width: '100%', padding: 8, marginTop: 6, boxSizing: 'border-box' }}
          />
        </label>

        <label style={{ display: 'block' }}>
          <div>Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{ width: '100%', padding: 8, marginTop: 6, boxSizing: 'border-box' }}
          />
        </label>

        {error && <div style={{ color: 'crimson' }}>{error}</div>}

        <button type="submit" style={{ padding: '10px 12px', borderRadius: 6, cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
}
