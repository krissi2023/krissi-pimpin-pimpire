import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { ComicCoverPlaceholder } from '../components/ImagePlaceholder';
import './ComicStore.css';

function ComicStore() {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchComics();
  }, []);

  const fetchComics = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/comics`);
      setComics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comics:', error);
      setLoading(false);
    }
  };

  const handlePurchase = async (comic) => {
    if (!isAuthenticated || !user) {
      alert('Please log in to purchase comics!');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/payments/create-checkout-session`,
        {
          comicId: comic.id,
          comicTitle: comic.title,
          price: comic.price,
          userId: user.userId || user.id
        }
      );

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to initiate purchase. Please try again.');
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="comic-store">
      <h1>📚 Comic Store</h1>
      <p className="store-subtitle">
        Purchase comics to unlock puzzles, wallpapers, and arcade games!
      </p>

      <div className="comics-grid">
        {comics.map(comic => (
          <div key={comic.id} className="comic-card card">
            <div className="comic-thumbnail">
              {comic.thumbnail ? (
                <img src={comic.thumbnail} alt={comic.title} />
              ) : (
                <ComicCoverPlaceholder title={comic.title} comicId={comic.id} />
              )}
            </div>
            <div className="comic-details">
              <h3>{comic.title}</h3>
              <p className="comic-description">{comic.description}</p>
              
              <div className="comic-includes">
                <span className="badge">📖 Comic</span>
                {comic.puzzleIncluded && <span className="badge">{comic.puzzlesCount || 3} 🧩 Puzzles</span>}
                {comic.wallpaperIncluded && <span className="badge">{comic.wallpapersCount || 5} 🖼️ Wallpapers</span>}
                <span className="badge arcade">🎰 ${(comic.arcadeCredits / 100).toFixed(2)} Credits</span>
                <span className="badge gold">⭐ {comic.goldPointsReward} Points</span>
                <span className="badge pb">💎 {comic.pbPoints} PB</span>
              </div>

              <div className="comic-footer">
                <span className="price">${(comic.price / 100).toFixed(2)}</span>
                <button 
                  className="btn btn-primary"
                  onClick={() => handlePurchase(comic)}
                >
                  Purchase
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComicStore;
