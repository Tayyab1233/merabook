import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const currentUserEmail = currentUser?.email || '';

  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [fatalError, setFatalError] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!currentUserEmail) {
      navigate('/login');
      return;
    }

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const existingPost = posts.find((post) => post.id === postId);

    if (!existingPost) {
      setFatalError('Post not found.');
      return;
    }

    if (existingPost.authorId !== currentUserEmail) {
      setFatalError('You can only edit your own posts.');
      return;
    }

    setText(existingPost.text || '');
    setImage(existingPost.image || '');
    setIsReady(true);
  }, [currentUserEmail, navigate, postId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (text.trim() === '' && !image) {
      setError('You must add some text or an image to save the post!');
      return;
    }

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postIndex = posts.findIndex((post) => post.id === postId);

    if (postIndex === -1) {
      setFatalError('Post not found.');
      return;
    }

    if (posts[postIndex].authorId !== currentUserEmail) {
      setFatalError('You can only edit your own posts.');
      return;
    }

    posts[postIndex] = {
      ...posts[postIndex],
      text: text,
      image: image || null,
      updatedAt: Date.now()
    };

    localStorage.setItem('posts', JSON.stringify(posts));
    navigate('/feed');
  };

  if (fatalError) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Edit Post</h2>
        <p style={{ color: 'red' }}>{fatalError}</p>
        <button
          type="button"
          onClick={() => navigate('/feed')}
          style={{ padding: '10px', backgroundColor: '#1877f2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Back to Feed
        </button>
      </div>
    );
  }

  if (!isReady) {
    return null;
  }

  return (
    <div className="create-post-container" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>Edit Post</h2>

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
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Replace Image (Optional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

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
          Save Changes
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

export default EditPost;
