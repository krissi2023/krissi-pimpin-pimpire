import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Arcade.css';

function Arcade() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/arcade/games`);
      setGames(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching games:', error);
      setLoading(false);
    }
  };

  const playGame = (game) => {
    if (!isAuthenticated) {
      alert('Please log in to play arcade games!');
      return;
    }
    
    if (user.arcadeCredits < game.minBet) {
      alert('Insufficient credits! Purchase a comic to get arcade credits.');
      return;
    }
    
    // TODO: Launch Phaser game
    alert(`Launching ${game.name}! (Game implementation coming soon)`);
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="arcade">
      <h1 className="neon-text">🎰 Diamondz Arcade</h1>
      <p className="arcade-subtitle">
        Play themed slot machines and win big!
      </p>

      {isAuthenticated && user ? (
        <div className="arcade-stats">
          <div className="stat-card card">
            <div className="stat-value">{user.goldPoints || 0}</div>
            <div className="stat-label">Gold Points</div>
          </div>
          <div className="stat-card card">
            <div className="stat-value">{user.pbPoints || 0}</div>
            <div className="stat-label">PB Points</div>
          </div>
          <div className="stat-card card">
            <div className="stat-value">${((user.arcadeCredits || 0) / 100).toFixed(2)}</div>
            <div className="stat-label">Arcade Credits</div>
          </div>
          <div className="stat-card card">
            <div className="stat-value">{user.totalWins || 0}</div>
            <div className="stat-label">Total Wins</div>
          </div>
        </div>
      ) : (
        <div className="login-prompt">
          <p>Please log in to view your stats and play games!</p>
        </div>
      )}

      <div className="games-grid">
        {games.map(game => (
          <div key={game.id} className="game-card card">
            <div className="game-header">
              <h3>{game.name}</h3>
              <span className="theme-badge">{game.theme}</span>
            </div>

            <div className="game-thumbnail">
              <div className="placeholder-game">🎰</div>
            </div>

            <div className="game-info">
              <div className="bet-range">
                <span>Min Bet: {game.minBet} 🪙</span>
                <span>Max Bet: {game.maxBet} 🪙</span>
              </div>
              <div className="rtp">
                <span>RTP: {game.rtp}%</span>
              </div>
            </div>

            <button 
              className="btn btn-arcade btn-play"
              onClick={() => playGame(game)}
            >
              Play Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Arcade;
