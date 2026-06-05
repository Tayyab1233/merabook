import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Load posts and protect route.
  // BUG FIXED: 'currentUser' is removed from the array below to stop the infinite loop!
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return; 
    }
    
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    // Sort so newest posts show at the very top
    savedPosts.sort((a, b) => b.createdAt - a.createdAt);
    setPosts(savedPosts);
  }, [navigate]); 

  // --- DELETE LOGIC ---
  const handleDelete = (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      const updatedPosts = posts.filter((post) => post.id !== postId);
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
    }
  };

  // --- SEARCH LOGIC ---
  const displayedPosts = posts.filter((post) => {
     // Safety check in case a post has no text
     const postText = post.text || '';
     return postText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="feed-wrapper">
      <div className="feed-container">
        
        {/* Search Bar Input */}
        <input 
          type="text" 
          placeholder="Search posts..." 
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <button 
          className="create-post-btn" 
          onClick={() => navigate('/create')}
          style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' }}
        >
          + Create New Post
        </button>

        {/* Display Posts */}
        {displayedPosts.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px' }}>
            <h3>No posts found!</h3>
          </div>
        ) : (
          displayedPosts.map((post) => (
            <div key={post.id} className="post-card" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              
              <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                <span className="post-author" style={{ fontWeight: 'bold', color: '#1877f2' }}>{post.authorName}</span>
                <span className="post-date" style={{ color: 'gray', fontSize: '0.9em' }}>{new Date(post.createdAt).toLocaleString()}</span>
              </div>

              <p className="post-text" style={{ whiteSpace: 'pre-wrap', marginBottom: '15px' }}>{post.text}</p>
              
              {post.image && (
                <img src={post.image} alt="Post attachment" className="post-image" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />
              )}

              {/* Only show Edit/Delete if the post belongs to the person logged in */}
              {currentUser && currentUser.email === post.authorId && (
                <div className="post-actions" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => navigate(`/edit/${post.id}`)} style={{ padding: '8px 16px', backgroundColor: '#ffc107', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(post.id)} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Delete
                  </button>
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