import Carousel from "react-bootstrap/Carousel";
import { FaPlay } from "react-icons/fa";
import "../../CSS/HomePage.css";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function HomePage() {
  const [data, setData] = useState([]);
  const [movieType, setMovieType] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedMovieType, setSelectedMovieType] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/movies")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching movies:", error));

    fetch("http://localhost:3001/genres")
      .then((response) => response.json())
      .then((data) => setGenres(data))
      .catch((error) => console.error("Error fetching genres:", error));

    fetch("http://localhost:3001/movietypes")
      .then((response) => response.json())
      .then((data) => setMovieType(data))
      .catch((error) => console.error("Error fetching movie types:", error));
  }, []);

  const handleMovieTypeFilter = (type) => {
    setSelectedMovieType(type.id);
  };

  const filteredData = data.filter(
    (movie) => movie.movie_type == selectedMovieType
  );

  const getGenreNames = (genreIds) =>
    genreIds
      .map((id) => genres.find((genre) => genre.id == id)?.name)
      .join(", ");

  const openModal = (movie) => {
    setVideoUrl(movie.video_url);
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setVideoUrl("");
    setSelectedMovie(null);
  };

  return (
    <>
      <Carousel slide interval={5000}>
        {data.map((movie, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={movie.banner}
              alt={`Slide ${index + 1}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      <div className="home-page-content">
        <nav className="navi">
          {movieType.length > 0 ? (
            movieType.map((type) => (
              <a
                key={type.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleMovieTypeFilter(type);
                }}
                className={selectedMovieType == type.id ? "actived" : ""}
              >
                {type.name}
              </a>
            ))
          ) : (
            <p>Loading movie types...</p>
          )}
        </nav>

        <div className="movie-list">
          {filteredData.length > 0 ? (
            filteredData.map((movie) => {
              return (
                <div className="movie-item" key={movie.id}>
                  <div className="image-container">
                    <img
                      style={{ height: "400px" }}
                      src={
                        movie.poster || "https://via.placeholder.com/200x300"
                      }
                      alt={movie.title}
                    />
                    <div
                      className="overlay-icon"
                      onClick={() => openModal(movie)}
                    >
                      <FaPlay size={40} color="white" />
                    </div>
                  </div>
                  <Link to={`/movie/${movie.id}`}> {movie.title}</Link>
                  <ul>
                    <li>
                      <span>Thể loại:</span> {getGenreNames(movie.genre_ids)}
                    </li>
                    <li>
                      <span>Thời lượng:</span> {movie.duration || "N/A"} phút
                    </li>
                    <li>
                      <span>Ngày khởi chiếu:</span>{" "}
                      {movie.release_date || "N/A"}
                    </li>
                  </ul>
                </div>
              );
            })
          ) : (
            <p>Loading movies...</p>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Trailer: {selectedMovie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            width="100%"
            height="415"
            src={videoUrl}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default HomePage;
