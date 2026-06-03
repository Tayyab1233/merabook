import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // <-- Importing our separate CSS file!

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return setError("All fields are required.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    // Local Storage check & save
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const emailExists = existingUsers.some((user) => user.email === email);
    
    if (emailExists) {
      return setError("This email is already registered.");
    }

    const newUser = { name, email, password };
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    navigate('/login');
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2 className="register-title">Register</h2>
        
        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <input 
            type="text" 
            className="register-input" 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          
          <input 
            type="email" 
            className="register-input" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />

          <input 
            type="password" 
            className="register-input" 
            placeholder="Password (min 6 chars)" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />

          <input 
            type="password" 
            className="register-input" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />

          <button type="submit" className="register-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;