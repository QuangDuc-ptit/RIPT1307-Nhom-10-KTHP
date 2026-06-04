import React from 'react';

interface Movie {
  id: number;
  title: string;
  image: string;
  rating?: string;
  age?: string;
}

interface MovieCardProps {
  movie: Movie;
  onBook: (e: React.MouseEvent) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onBook }) => {
  return (
    <div className="movie-card">
      <div className="card-thumb">
        <img src={movie.image} alt={movie.title} />
        <span className={`badge-age ${movie.age}`}>{movie.age}</span>
        {movie.rating && <span className="badge-rating">⭐ {movie.rating}</span>}
        <div className="card-hover-overlay">
          <button className="btn-book" onClick={onBook}>Mua Vé / Chi Tiết</button>
        </div>
      </div>
      <div className="card-info">
        <h3>{movie.title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;
