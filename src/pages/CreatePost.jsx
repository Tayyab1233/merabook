import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  
  const [text, setText] = useState('');
  const [image, setImage] = useState(''); // This will hold our Base64 string
  const [error, setError] = useState('');

  // 1. Get the current user
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // --- AUTHENTICATION GUARD ---
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [navigate, currentUser]);

  // --- IMAGE TO BASE64 LOGIC ---
  const handleImageChange = (e) => {
    // Grab the first file the user selected
    const file = e.target.files[0]; 
    
    if (file) {
      // Create a new FileReader (built into JavaScript)
      const reader = new FileReader(); 
      
      // Tell the reader what to do WHEN it finishes reading the file
      reader.onloadend = () => {
        // reader.result contains the Base64 text string
        setImage(reader.result); 
      };
      
      // Tell the reader to start reading the file
      reader.readAsDataURL(file);
    }
  };

  // --- SUBMIT LOGIC ---
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check: Are both empty? We need at least one to make a post.
    if (!text.trim() && !image) {
      return setError("Please write something or attach an image.");
    }

    // Build the new post object exactly as required
    const newPost = {
      id: Date.now().toString(),
      authorId: currentUser.email,
      authorName: currentUser.name,
      text: text,
      image: image,
      createdAt: Date.now(),
      updatedAt: Date.now() // Set it to now initially
    };

    // Grab old posts, add the new one, and save back to storage
    const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];
    existingPosts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(existingPosts));

    // Send them back to the feed to see their new post!
    navigate('/feed');
  };

  return (
    <div className="create-wrapper">
      <div className="create-card">
        <h2 className="create-title">Create Post</h2>
        
        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="create-form">
          <textarea 
            className="create-textarea" 
            rows="4" 
            placeholder={`What's on your mind, ${currentUser?.name}?`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <div className="file-input-container">
            <label className="file-label">Attach Image (Optional)</label>
            <input 
              type="file" 
              accept="image/*" 
              className="create-file-input"
              onChange={handleImageChange} 
            />
          </div>

          {/* PREVIEW: If an image exists in state, show it before posting */}
          {image && (
            <div className="preview-container">
              <p className="preview-title">Image Preview:</p>
              <img src={image} alt="Preview" className="image-preview" />
            </div>
          )}

          <div className="button-group">
            <button type="submit" className="post-btn">Post</button>
            <button type="button" className="cancel-btn" onClick={() => navigate('/feed')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;