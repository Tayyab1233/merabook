import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Look in localStorage to see if someone is logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // The logout function
  const handleLogout = () => {
    localStorage.removeItem('currentUser'); // 1. Delete the user session
    navigate('/login'); // 2. Send them back to the login screen
  };

  return (
    <nav className="navbar-container">
      <h2 className="navbar-logo">MeraBook</h2>
      
      {/* ONLY show the welcome text and Logout button if a user is logged in */}
      {currentUser && (
        <div className="navbar-user-section">
          <span className="navbar-name">Hi, {currentUser.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;