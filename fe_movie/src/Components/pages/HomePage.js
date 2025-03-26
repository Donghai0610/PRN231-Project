import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { FaPlay, FaTimes } from 'react-icons/fa';
import Slider from 'react-slick';
import Carousel from 'react-bootstrap/Carousel';
import Movie_Service from '../../services/movie';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../CSS/HomePage.css';

function HomePage() {
  const [topMovies, setTopMovies] = useState([]);
  const [hotMovies, setHotMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    let videoId = '';
    
    const watchUrlMatch = url.match(/(?:youtube\.com\/watch\?v=)([^&]+)/);
    if (watchUrlMatch) {
      videoId = watchUrlMatch[1];
    }
    
    const shortUrlMatch = url.match(/(?:youtu\.be\/)([^?]+)/);
    if (shortUrlMatch) {
      videoId = shortUrlMatch[1];
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  useEffect(() => {
    fetchAllMovies();
  }, []);

  const formatMovieData = (movies) => {
    return movies.map(movie => ({
      id: movie.movieId,
      title: movie.movieName,
      image: movie.image,
      genres: movie.genres.map(genre => genre.name).join(", "),
      release_date: new Date(movie.releaseDate).toLocaleDateString('vi-VN'),
      video_url: movie.movieUrl
    }));
  };

  const fetchAllMovies = async () => {
    try {
      setLoading(true);
      const [topResponse, hotResponse, upcomingResponse] = await Promise.all([
        Movie_Service.GetMovieTop4(),
        Movie_Service.GetMovieHot(),
        Movie_Service.GetMovieRelsease()
      ]);

      setTopMovies(formatMovieData(topResponse));
      setHotMovies(formatMovieData(hotResponse));
      setUpcomingMovies(formatMovieData(upcomingResponse));
    } catch (error) {
      console.error("Lỗi khi tải danh sách phim:", error);
      setError("Có lỗi xảy ra khi tải danh sách phim");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (movie) => {
    const embedUrl = getEmbedUrl(movie.video_url);
    setVideoUrl(embedUrl);
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setVideoUrl("");
    setSelectedMovie(null);
  };

  const MovieCard = ({ movie }) => (
    <div className="movie-item">
      <div className="image-container">
        <img src={movie.image} alt={movie.title} />
        <div className="overlay-icon" onClick={() => openModal(movie)}>
          <FaPlay size={24} />
        </div>
      </div>
      <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
      <ul>
        <li><span>Thể loại:</span> {movie.genres}</li>
        <li><span>Khởi chiếu:</span> {movie.release_date}</li>
      </ul>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="homepage">
      <Carousel fade interval={5000}>
        {topMovies.map((movie, index) => (
          <Carousel.Item key={index}>
            <img className="d-block w-100" src={movie.image} alt={movie.title} />
            <Carousel.Caption>
              <h3>{movie.title}</h3>
              <p>{movie.genres}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <div className="home-page-content">
        <section className="movie-section">
          <h2 className="section-title">Phim Đề Xuất</h2>
          <div className="movie-grid">
            {topMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        <section className="movie-section">
          <h2 className="section-title">Phim Bộ Đang Chiếu</h2>
          <div className="movie-grid">
            {hotMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        <section className="movie-section">
          <h2 className="section-title">Phim Sắp Chiếu</h2>
          <Slider {...sliderSettings}>
            {upcomingMovies.map(movie => (
              <div key={movie.id} className="slider-movie-item">
                <div className="image-container">
                  <img src={movie.image} alt={movie.title} />
                  <div className="overlay-icon" onClick={() => openModal(movie)}>
                    <FaPlay size={24} />
                  </div>
                </div>
                <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
                <ul>
                  <li><span>Thể loại:</span> {movie.genres}</li>
                  <li><span>Khởi chiếu:</span> {movie.release_date}</li>
                </ul>
              </div>
            ))}
          </Slider>
        </section>
      </div>

      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedMovie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {videoUrl ? (
            <div className="video-container">
              <iframe
                width="100%"
                height="415"
                src={videoUrl}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="no-video">Không có trailer cho phim này</div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default HomePage;
