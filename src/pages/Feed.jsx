import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  
  // NEW: State to hold what the user types in the search bar
  const [searchTerm, setSearchTerm] = useState(''); 
  
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!currentUser) {
      return navigate('/login');
    }
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    savedPosts.sort((a, b) => b.createdAt - a.createdAt);
    setPosts(savedPosts);
  }, [navigate, currentUser]);

  // --- NEW: DELETE LOGIC ---
  const handleDelete = (postId) => {
    // 1. Show a confirmation popup
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      // 2. Filter the array: Keep every post EXCEPT the one with this ID
      const updatedPosts = posts.filter((post) => post.id !== postId);
      
      // 3. Save the new array to localStorage and update the screen
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
    }
  };

  // --- NEW: SEARCH LOGIC ---
  // Instead of mapping the raw 'posts' array, we map this 'displayedPosts' array.
  // It only keeps posts where the text includes the search term.
  const displayedPosts = posts.filter((post) => 
    post.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="feed-wrapper">
      <div className="feed-container">
        
        {/* NEW: Search Bar Input */}
        <input 
          type="text" 
          placeholder="Search posts..." 
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button className="create-post-btn" onClick={() => navigate('/create')}>
          + Create New Post
        </button>

        {/* Change 'posts' to 'displayedPosts' to make the search work */}
        {displayedPosts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts found!</h3>
          </div>
        ) : (
          displayedPosts.map((post) => (
            <div key={post.id} className="post-card">
              
              <div className="post-header">
                <span className="post-author">{post.authorName}</span>
                <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
              </div>

              <p className="post-text">{post.text}</p>
              
              {post.image && <img src={post.image} alt="Post" className="post-image" />}

              {currentUser.email === post.authorId && (
                <div className="post-actions">
                  <button className="edit-btn" onClick={() => navigate(`/edit/${post.id}`)}>Edit</button>
                  {/* NEW: Delete Button */}
                  <button className="delete-btn" onClick={() => handleDelete(post.id)}>Delete</button>
                </div>
              )}

            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default Feed;