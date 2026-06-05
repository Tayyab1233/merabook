import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null); // Will hold the Base64 image
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Protect the route: send back to login if not signed in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Handle Image Upload and convert to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // This is the Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Both text and image empty = error
    if (text.trim() === '' && !image) {
      setError('You must add some text or an image to post!');
      return;
    }

    // Create the post object
    const newPost = {
      id: Date.now().toString(),
      authorId: currentUser.email,
      authorName: currentUser.name,
      text: text,
      image: image, // Base64 string or null
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Grab existing posts, add the new one, and save back to local storage
    const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];
    existingPosts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(existingPosts));

    // Redirect back to the feed
    navigate('/feed');
  };

  return (
    <div className="create-post-container" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>Create New Post</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <textarea 
          placeholder="What's on your mind?" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="5"
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', resize: 'vertical' }}
        />

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Attach an Image (Optional):</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
        </div>

        {/* Show a preview of the image if the user selects one */}
        {image && (
          <div style={{ marginTop: '10px' }}>
            <p>Image Preview:</p>
            <img src={image} alt="Preview" style={{ maxWidth: '100%', borderRadius: '5px' }} />
          </div>
        )}

        <button 
          type="submit" 
          style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Post
        </button>
        
        <button 
          type="button" 
          onClick={() => navigate('/feed')}
          style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Cancel
        </button>

      </form>
    </div>
  );
};

export default CreatePost;