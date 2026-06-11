import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost'; // <-- 1. Import it
import EditPost from './pages/EditPost';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        
        {/* 2. Add the route here! */}
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:postId" element={<EditPost />} />
      </Routes>
    </Router>
  );
}

export default App;