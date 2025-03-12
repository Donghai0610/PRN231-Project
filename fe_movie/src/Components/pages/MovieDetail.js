import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaFacebookF, FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import Movie_Service from "../../services/movie";
import "./MovieDetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await Movie_Service.GetMovieById(id);
        setMovie(response);
        console.log("Movie detail:", response);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovieDetail();
  }, [id]);

  if (!movie) {
    return <div className="movie-detail-container">Loading...</div>;
  }

  const releaseYear = new Date(movie.releaseDate).getFullYear();

  const handleWatchMovie = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = movie.movieUrl ? getYouTubeVideoId(movie.movieUrl) : null;

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-header">
        <div className="movie-poster">
          <img src={movie.image} alt={movie.movieName} />
          <button className="watch-movie-btn" onClick={handleWatchMovie}>
            <FaPlay /> Xem Phim
          </button>
        </div>
        <div className="movie-info-section">
          <h1>{movie.movieName}</h1>
          <h2>Hiệp sĩ mù: Tái sinh ({releaseYear})</h2>
          
          <div className="rating-section">
            <div className="tv-rating">TV-MA</div>
            <div className="imdb-rating">
              <span className="imdb-label">IMDb</span>
              <span className="rating-value">9.3</span>
            </div>
            <div className="social-buttons">
              <button className="facebook-share">
                <FaFacebookF /> Chia sẻ
              </button>
              <button className="add-list">+ Thêm vào tập</button>
            </div>
          </div>

          <div className="movie-creators">
            <div className="creator-section">
              <h3>SÁNG LẬP</h3>
              <p>Matt Corman, Dario Scardapane, Chris Ord</p>
            </div>
            <div className="creator-section">
              <h3>QUỐC GIA</h3>
              <p>Mỹ</p>
            </div>
            <div className="creator-section">
              <h3>KHỞI CHIẾU</h3>
              <p>{new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          <p className="movie-description">{movie.description}</p>

          <div className="cast-section">
            <h2>DIỄN VIÊN</h2>
            <div className="cast-list-container">
              <button className="cast-nav-btn prev">
                <FaChevronLeft />
              </button>
              <div className="cast-list">
                {movie.actors.map((actor) => (
                  <div key={actor.actorId} className="cast-member">
                    <div className="cast-image">
                      <img src={actor.image} alt={actor.fullName} />
                    </div>
                    <div className="cast-info">
                      <h4>{actor.fullName}</h4>
                      <p>{actor.character || actor.fullName}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="cast-nav-btn next">
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="trailer-section">
        <h2>TRAILER</h2>
        <div className="trailer-grid">
          <div className="trailer-item">
            <img src={movie.image} alt="Trailer 1" />
          </div>
          <div className="trailer-item">
            <img src={movie.image} alt="Trailer 2" />
          </div>
          <div className="trailer-item">
            <img src={movie.image} alt="Trailer 3" />
          </div>
          <div className="trailer-item">
            <img src={movie.image} alt="Trailer 4" />
          </div>
        </div>
      </div>

      <div className="season-section">
        <h2>SEASON</h2>
        {/* Season content will be added later */}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{movie.movieName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="video-container">
            {videoId && (
              <iframe
                width="100%"
                height="480"
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MovieDetail;
