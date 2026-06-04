// src/pages/LandingPage/components/MovieCard.tsx
import React from 'react';
import { Button } from 'antd';
import { StarFilled } from '@ant-design/icons';

interface Movie {
  id: number;
  title: string;
  category: string;
  genre: string;
  image: string;
  rating: string;
  age: string;
}

interface MovieCardProps {
  movie: Movie;
  onBook: (e: React.SyntheticEvent) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onBook }) => {
  const isComingSoon = movie.category === 'sap-chieu';
  const ratingValue = isComingSoon ? 'Chưa chiếu' : movie.rating;

  return (
    <div className="movie-card-item">
      <div className="movie-card-inner">
        <div className="movie-poster-wrapper">
          <img src={movie.image} alt={movie.title} className="movie-poster-img" />
          {!isComingSoon && (
            <div className="movie-rating">
              <StarFilled style={{ color: '#fadb14', fontSize: 12 }} />
              <span>{movie.rating}</span>
            </div>
          )}
          <div className="movie-age-badge">{movie.age}</div>
          <div className="movie-overlay">
            <Button 
              type="primary" 
              danger 
              shape="round" 
              size="large" 
              onClick={onBook}
              style={{ fontWeight: 'bold' }}
            >
              {isComingSoon ? 'Sắp chiếu' : 'Đặt vé'}
            </Button>
          </div>
        </div>
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-meta">
          {movie.genre === 'tinh-cam' ? 'Tình cảm' : 
           movie.genre === 'hanh-dong' ? 'Hành động' :
           movie.genre === 'hoat-hinh' ? 'Hoạt hình' :
           movie.genre === 'kinh-di' ? 'Kinh dị' : movie.genre}
        </p>
      </div>

      <style>{`
        .movie-card-item {
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .movie-card-item:hover {
          transform: translateY(-6px);
        }
        .movie-card-inner {
          background: rgba(20, 20, 20, 0.6);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(4px);
          transition: all 0.3s;
        }
        .movie-poster-wrapper {
          position: relative;
          aspect-ratio: 2/3;
          overflow: hidden;
          border-radius: 20px 20px 0 0;
        }
        .movie-poster-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .movie-card-item:hover .movie-poster-img {
          transform: scale(1.05);
        }
        .movie-rating {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          z-index: 2;
        }
        .movie-age-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
          color: #ffb4aa;
          z-index: 2;
        }
        .movie-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .movie-card-item:hover .movie-overlay {
          opacity: 1;
        }
        .movie-title {
          font-size: 1rem;
          font-weight: 700;
          color: #ffdad5;
          margin: 12px 12px 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .movie-meta {
          font-size: 0.75rem;
          color: #e9bcb6;
          margin: 0 12px 12px;
        }
      `}</style>
    </div>
  );
};

export default MovieCard;