import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already logged in, redirect to feed immediately
  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      navigate('/feed');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Find user with matching email and password
    const foundUser = existingUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (!foundUser) {
      return setError("Invalid email or password.");
    }

    // Save current user to start session
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    navigate('/feed');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        
        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <input 
            type="email" 
            className="login-input" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />

          <input 
            type="password" 
            className="login-input" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />

          <button type="submit" className="login-btn">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;