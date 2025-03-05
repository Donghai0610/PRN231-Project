import React, { useEffect, useState } from "react";
import "../../CSS/MovieDetail.css";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, Table } from "react-bootstrap";
import { IoTicketOutline } from "react-icons/io5";
const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [cinema, setCinema] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const navigate = useNavigate();
  const handleBookTicket = () => {
    if (selectedShowtime) {
      navigate(`/booking/${movie.id}`, {
        state: { showtimeId: selectedShowtime.id },
      });
    }
  };
  const handleShowtimeClick = (showtime) => {
    setSelectedShowtime(showtime);
  };

  const handleCloseModal = () => {
    setSelectedShowtime(null);
  };

  useEffect(() => {
    fetch(`http://localhost:3001/movies/${id}`)
      .then((response) => response.json())
      .then((data) => setMovie(data))
      .catch((error) => console.error("Error fetching movie:", error));

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
  }, [id]);

  useEffect(() => {
    if (movie?.showtimes?.length > 0) {
      const earliestDate = movie.showtimes
        .map((showtime) => showtime.date)
        .sort()[0];
      setSelectedDate(earliestDate);
    }
  }, [movie]);

  if (!movie) {
    return <p>Loading movie details...</p>;
  }

  const getGenreNames = (genreIds) =>
    genreIds
      .map((id) => genres.find((genre) => genre.id == id)?.name)
      .join(", ");

  const getLanguageName = (languageId) =>
    languages.find((language) => language.id == languageId)?.name;

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const time = new Date();
    time.setHours(hours, minutes, seconds, 0);
    return time.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const filteredShowtimes = movie.showtimes.filter(
    (showtime) => showtime.date == selectedDate
  );

  return (
    <div className="movie-detail">
      <main className="content">
        <div className="breadcrumb" style={{ fontSize: "1.5rem" }}>
          <a href="#">Home</a> &gt;{" "}
          <span className="highlight">{movie.title}</span>
        </div>

        <div className="movie-info">
          <div className="posters">
            <img
              src={movie.poster}
              alt={`${movie.title} Poster`}
              className="poster-image"
            />
          </div>

          <div className="details">
            <h1>{movie.title}</h1>
            <p>{movie.description}</p>
            <ul className="list-unstyled row">
              <li className="col-md-3 col-sm-5">
                <strong>ĐẠO DIỄN:</strong>
              </li>
              <li className="col-md-9 col-sm-7">{movie.director}</li>

              <li className="col-md-3 col-sm-5">
                <strong>DIỄN VIÊN:</strong>
              </li>
              <li className="col-md-9 col-sm-7">{movie.actor}</li>

              <li className="col-md-3 col-sm-5">
                <strong>THỂ LOẠI:</strong>
              </li>
              <li className="col-md-9 col-sm-7">
                {getGenreNames(movie.genre_ids)}
              </li>

              <li className="col-md-3 col-sm-5">
                <strong>THỜI LƯỢNG:</strong>
              </li>
              <li className="col-md-9 col-sm-7">{movie.duration} phút</li>

              <li className="col-md-3 col-sm-5">
                <strong>NGÔN NGỮ:</strong>
              </li>
              <li className="col-md-9 col-sm-7">
                {getLanguageName(movie.language_id)}
              </li>

              <li className="col-md-3 col-sm-5">
                <strong>NGÀY KHỞI CHIẾU:</strong>
              </li>
              <li className="col-md-9 col-sm-7">{movie.release_date}</li>
            </ul>
          </div>
        </div>

        <div className="container">
          <div className="date-selector">
            {movie.showtimes
              .map((s) => s.date)
              .filter((value, index, self) => self.indexOf(value) === index)
              .sort((a, b) => new Date(a) - new Date(b))
              .map((date) => (
                <div
                  key={date}
                  className={`date-item ${
                    selectedDate === date ? "active" : ""
                  }`}
                  onClick={() => handleDateClick(date)}
                >
                  {formatDate(date)}
                </div>
              ))}
          </div>

          <div className="schedule">
            <h2>{getLanguageName(movie.language_id)}</h2>
            {filteredShowtimes.length > 0 ? (
              <div className="time-slot">
                {filteredShowtimes.map((showtime) => (
                  <div
                    key={showtime.id}
                    className="time-box"
                    onClick={() => handleShowtimeClick(showtime)}
                  >
                    <p>{formatTime(showtime.start_time)}</p>
                    <span>Giá vé: {showtime.price.toLocaleString()} VNĐ</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Không có suất chiếu nào cho ngày này.</p>
            )}
          </div>
          <div className="trainer">
            <h1 class="title">TRAILER</h1>
            <div class="video-container">
              <iframe
                src={movie.video_url}
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
          </div>
          <Modal
            show={selectedShowtime}
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
                  <h5>{movie.title}</h5>
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
                <IoTicketOutline
                  style={{ marginRight: "8px", fontSize: "1.5rem" }}
                />
                Đặt vé
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </main>
    </div>
  );
};

export default MovieDetail;
