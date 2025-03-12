import Carousel from "react-bootstrap/Carousel";
import { FaPlay } from "react-icons/fa";
import "../../CSS/HomePage.css";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Movie_Service from "../../services/movie";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function HomePage() {
  const [topMovies, setTopMovies] = useState([]);
  const [hotMovies, setHotMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Cấu hình cho slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
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

  // Hàm chuyển đổi URL YouTube thành URL nhúng
  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    // Xử lý các dạng URL YouTube phổ biến
    let videoId = '';
    
    // Xử lý URL dạng đầy đủ: https://www.youtube.com/watch?v=VIDEO_ID
    const watchUrlMatch = url.match(/(?:youtube\.com\/watch\?v=)([^&]+)/);
    if (watchUrlMatch) {
      videoId = watchUrlMatch[1];
    }
    
    // Xử lý URL dạng rút gọn: https://youtu.be/VIDEO_ID
    const shortUrlMatch = url.match(/(?:youtu\.be\/)([^?]+)/);
    if (shortUrlMatch) {
      videoId = shortUrlMatch[1];
    }

    // Nếu tìm thấy video ID, trả về URL nhúng
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Nếu không phải URL YouTube hợp lệ, trả về URL gốc
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
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phim:", error);
      setError("Có lỗi xảy ra khi tải danh sách phim");
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

  const MovieList = ({ movies, title }) => (
    <div className="movie-section">
      <h2 className="section-title">{title}</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div className="movie-item" key={movie.id}>
            <div className="image-container">
              <img
                style={{ height: "400px" }}
                src={movie.image}
                alt={movie.title}
              />
              <div
                className="overlay-icon"
                onClick={() => openModal(movie)}
              >
                <FaPlay size={40} color="white" />
              </div>
            </div>
            <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
            <ul>
              <li>
                <span>Thể loại:</span> {movie.genres}
              </li>
              <li>
                <span>Ngày xuất chiếu:</span> {movie.release_date}
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const MovieSlider = ({ movies, title }) => (
    <div className="movie-section">
      <h2 className="section-title">{title}</h2>
      <Slider {...sliderSettings}>
        {movies.map((movie) => (
          <div key={movie.id} className="slider-movie-item">
            <div className="image-container">
              <img src={movie.image} alt={movie.title} />
              <div className="overlay-icon" onClick={() => openModal(movie)}>
                <FaPlay size={40} color="white" />
              </div>
            </div>
            <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
            <ul>
              <li><span>Thể loại:</span> {movie.genres}</li>
              <li><span>Ngày chiếu:</span> {movie.release_date}</li>
            </ul>
          </div>
        ))}
      </Slider>
    </div>
  );

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Carousel slide interval={5000}>
        {topMovies.map((movie, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={movie.image}
              alt={movie.title}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      <div className="home-page-content">
        <MovieList movies={topMovies} title="Phim Đề Xuất" />
        <MovieList movies={hotMovies} title="Phim Bộ Đang Chiếu" />
        <MovieSlider movies={upcomingMovies} title="Phim Sắp Chiếu" />
      </div>

      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Trailer: {selectedMovie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {videoUrl ? (
            <iframe
              width="100%"
              height="415"
              src={videoUrl}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div>Không có trailer cho phim này</div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default HomePage;
