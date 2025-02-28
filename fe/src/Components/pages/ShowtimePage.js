import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import "../../CSS/ShowTime.css";
import { IoTicketOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function ShowTime() {
  const [selectedDates, setSelectedDates] = useState({});
  const [movie, setMovie] = useState([]);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [cinema, setCinema] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/movies")
      .then((response) => response.json())
      .then((data) => {
        setMovie(data);
        const initialDates = {};
        data.forEach((movie) => {
          if (movie.showtimes?.length > 0) {
            const minDate = movie.showtimes.map((st) => st.date).sort()[0];
            initialDates[movie.id] = minDate;
          }
        });
        setSelectedDates(initialDates);
      })
      .catch((error) => console.error("Error fetching movies:", error));

    fetch("http://localhost:3001/genres")
      .then((response) => response.json())
      .then((data) => setGenres(data))
      .catch((error) => console.error("Error fetching genres:", error));

    fetch("http://localhost:3001/languages")
      .then((response) => response.json())
      .then((data) => setLanguages(data))
      .catch((error) => console.error("Error fetching languages:", error));

    fetch(`http://localhost:3001/cinema/1`)
      .then((response) => response.json())
      .then((data) => setCinema(data))
      .catch((error) => console.error("Error fetching showtimes:", error));
  }, []);

  const getUniqueDates = (showtimes) => {
    const uniqueDates = [...new Set(showtimes.map((time) => time.date))];
    return uniqueDates.sort();
  };
  console.log(cinema);

  const getGenreNames = (genreIds) =>
    genreIds
      .map((id) => genres.find((genre) => genre.id == id)?.name)
      .join(", ");

  const getLanguageName = (languageId) =>
    languages.find((language) => language.id == languageId)?.name;

  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const handleDateClick = (movieId, date) => {
    setSelectedDates((prev) => ({
      ...prev,
      [movieId]: date,
    }));
  };

  const handleShowtimeClick = (movieId, showtime) => {
    setSelectedMovieId(movieId); // Set selected movie ID
    setSelectedShowtime(showtime); // Set selected showtime to open modal
  };

  const handleBookTicket = () => {
    if (selectedShowtime && selectedMovieId) {
      // Navigate to booking page with selected movieId and showtimeId
      navigate(`/booking/${selectedMovieId}`, {
        state: { showtimeId: selectedShowtime.id, movieId: selectedMovieId }
      });
    }
  };

  const handleCloseModal = () => {
    setSelectedShowtime(null);
  };

  return (
    <div className="movie-container">
      {movie.map((movie) => (
        <div key={movie.id} className="movie-details">
          <div className="movie-poster">
            <img
              src={movie.poster || "https://via.placeholder.com/200x300"}
              alt={movie.title || "Untitled Movie"}
            />
          </div>

          <div className="movie-infos">
            <h2 className="movie-title">{movie.title || "Untitled Movie"}</h2>
            <div className="movie-genre">
              <span>{getGenreNames(movie.genre_ids)}</span> •{" "}
              {movie.duration || 0} phút
            </div>

            <div className="showtime-section">
              <h3>{getLanguageName(movie.language_id)}</h3>
              <div className="date-navigation">
                {movie.showtimes?.length > 0 &&
                  getUniqueDates(movie.showtimes).map((date, idx) => (
                    <div
                      key={idx}
                      className={`date-item ${
                        selectedDates[movie.id] === date ? "active" : ""
                      }`}
                      onClick={() => handleDateClick(movie.id, date)}
                    >
                      {formatDate(date)}
                    </div>
                  ))}
              </div>
              <div className="showtimess">
                {movie.showtimes
                  ?.filter(
                    (showtime) => showtime.date === selectedDates[movie.id]
                  )
                  .map((showtime, idx) => (
                    <div
                      key={idx}
                      className="showtime-item"
                      onClick={() => handleShowtimeClick(movie.id, showtime)}
                    >
                      <span>{formatTime(showtime.start_time)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Modal to display selected showtime */}
      <Modal
        show={selectedShowtime !== null} // Open modal if selectedShowtime is not null
        onHide={handleCloseModal}
        centered
        className="custom-modal"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Bạn đang đặt vé xem phim</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedShowtime && (
            <>
              <h5>{movie.find((m) => m.id === selectedMovieId)?.title}</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Rạp chiếu</th>
                    <th>Ngày chiếu</th>
                    <th>Giờ chiếu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{cinema.name}</td>
                    <td>{selectedShowtime.date}</td>
                    <td>{formatTime(selectedShowtime.start_time)}</td>
                  </tr>
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleBookTicket}>
            <IoTicketOutline style={{ marginRight: "8px", fontSize: "1.5rem" }} />
            Đặt vé
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ShowTime;
