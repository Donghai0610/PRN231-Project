import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Pagination } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import Movie_Service from '../../services/movie';
import Genre_Services from '../../services/genre';
import Actor_Service from '../../services/actor';
import { Link } from 'react-router-dom';
import './MovieList.css';
import axiosInstance from '../../services/axios';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [actors, setActors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedActor, setSelectedActor] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [releaseYear, setReleaseYear] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchMovies();
    }, [ currentPage]);

    const fetchInitialData = async () => {
        try {
            const [genresResponse, actorsResponse] = await Promise.all([
                Genre_Services.GetAllGenreUser(),
                Actor_Service.GetAllActorsUser()
            ]);

            console.log('Genres Response:', genresResponse);
            console.log('Actors Response:', actorsResponse);

            // Kiểm tra và set genres
            if (genresResponse) {
                setGenres(genresResponse);
            }

            // Kiểm tra và set actors
            if (actorsResponse && Array.isArray(actorsResponse)) {
                setActors(actorsResponse);
            } else if (actorsResponse && actorsResponse.data && Array.isArray(actorsResponse.data)) {
                setActors(actorsResponse.data);
            } else {
                console.error('Không thể xử lý dữ liệu actors:', actorsResponse);
            }

        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            setError('Có lỗi xảy ra khi tải dữ liệu');
        }
    };

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const skip = (currentPage - 1) * itemsPerPage;

            const response = await Movie_Service.GetAllMoviesForUser(
                selectedGenre,
                selectedActor,
                searchTerm,
                releaseYear,
                skip,
                itemsPerPage
            );
            const totalCount = await axiosInstance.get('/api/Movies?$filter=isActive eq true');

            if (Array.isArray(response.data)) {
                setMovies(response.data);
                setTotalPages(Math.ceil(totalCount.data.length / itemsPerPage));
            } else if (response.data?.value) {
                setMovies(response.data.value);
                setTotalPages(Math.ceil(totalCount.data.length / itemsPerPage));
            }

            setLoading(false);
        } catch (error) {
            console.error('Lỗi khi tải danh sách phim:', error);
            setError('Có lỗi xảy ra khi tải danh sách phim');
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchMovies();
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedActor('');
        setReleaseYear('');
        setCurrentPage(1);
        fetchMovies();
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }
        return <Pagination>{items}</Pagination>;
    };

    const MovieCard = ({ movie }) => (
        <div className="movie-card">
            <div className="movie-image">
                <img src={movie.image} alt={movie.movieName} />
            </div>
            <div className="movie-info">
                <h3>{movie.movieName}</h3>
                <p className="movie-meta">
                    <span className="year">{new Date(movie.releaseDate).getFullYear()}</span>
                    <span className="duration">120 phút</span>
                </p>
                <p className="genres">{movie.genres.map(g => g.name).join(', ')}</p>
                <div className="movie-buttons">
                    <Link to={`/movie/${movie.movieId}`} className="btn-watch-now">
                        Xem ngay
                    </Link>
                    <Link to={`/movie/${movie.movieId}`} className="btn-details">
                        Chi tiết
                    </Link>
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <Container fluid className="movie-list-container">
            <Row>
                <Col md={3}>
                    <div className="filters-sidebar">
                        <div className="filter-section">
                            <h4>Thể Loại</h4>
                            <div className="filter-list">
                                {genres && genres.length > 0 ? genres.map(genre => (
                                    <Form.Check
                                        key={genre.genreId}
                                        type="checkbox"
                                        label={genre.name}
                                        checked={selectedGenre === genre.name}
                                        onChange={() => setSelectedGenre(selectedGenre === genre.name ? '' : genre.name)}
                                    />
                                )) : <p>Không có thể loại</p>}
                            </div>
                        </div>
                    </div>
                </Col>

                <Col md={9}>
                    <div className="search-container">
                        <Form onSubmit={handleSearch} className="d-flex align-items-center gap-2">
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Tìm kiếm phim..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Tìm theo diễn viên..."
                                value={selectedActor}
                                onChange={(e) => setSelectedActor(e.target.value)}
                                className="search-input"
                            />
                            <Form.Control
                                size="sm"
                                type="number"
                                placeholder="Năm phát hành..."
                                min="1900"
                                max={new Date().getFullYear()}
                                value={releaseYear}
                                onChange={(e) => setReleaseYear(e.target.value)}
                                className="search-input"
                            />
                            <Button 
                                style={{backgroundColor: '#e50914', border: 'none', width: '100px'}} 
                                type="submit" 
                                variant="primary" 
                                size="sm"
                            >
                                <FaSearch /> Tìm kiếm
                            </Button>
                            <Button 
                                style={{backgroundColor: '#6c757d', border: 'none', width: '100px'}} 
                                type="button" 
                                variant="secondary" 
                                size="sm"
                                onClick={handleReset}
                            >
                                Làm mới
                            </Button>
                        </Form>
                    </div>

                    <div className="movies-container">
                        {movies && movies.length > 0 ? movies.map(movie => (
                            <MovieCard key={movie.movieId} movie={movie} />
                        )) : <div className="no-movies">Không có phim nào</div>}
                    </div>

                    <div className="pagination-container">
                        {renderPagination()}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default MovieList;
