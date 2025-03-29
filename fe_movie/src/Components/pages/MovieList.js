import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { FaSearch, FaFilter, FaTimes, FaPlay, FaClock, FaStar } from 'react-icons/fa';
import Movie_Service from '../../services/movie';
import Genre_Services from '../../services/genre';
import Actor_Service from '../../services/actor';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './MovieList.css';
import axiosInstance from '../../services/axios';
import { useDebounce } from 'use-debounce';

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
    const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
    const [releaseYear, setReleaseYear] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchMovies();
    }, [currentPage, debouncedSearchTerm, selectedGenre, selectedActor, releaseYear]);

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

            // Lấy phim theo trang hiện tại và bộ lọc
            const response = await Movie_Service.GetAllMoviesForUser(
                selectedGenre,
                selectedActor,
                debouncedSearchTerm, // Sử dụng giá trị đã debounce
                releaseYear,
                skip,
                itemsPerPage
            );

            // Xây dựng điều kiện tìm kiếm để lấy tổng số phim
            let filterParams = { $filter: 'isActive eq true' };
            
            if (debouncedSearchTerm) {
                filterParams.$filter += ` and contains(movieName, '${debouncedSearchTerm}')`;
            }
            
            if (selectedGenre) {
                // Thêm điều kiện thể loại nếu cần
                filterParams.$filter += ` and genres/any(g: g/name eq '${selectedGenre}')`;
            }
            
            if (selectedActor) {
                // Thêm điều kiện diễn viên nếu cần
                filterParams.$filter += ` and actors/any(a: contains(a/actorName, '${selectedActor}'))`;
            }
            
            if (releaseYear) {
                // Thêm điều kiện năm phát hành nếu cần
                filterParams.$filter += ` and year(releaseDate) eq ${releaseYear}`;
            }

            // Lấy tổng số phim thỏa mãn điều kiện để tính số trang
            const totalCountResponse = await axiosInstance.get('/api/Movies', { params: filterParams });
            
            const totalCount = totalCountResponse.data.length || 0;
            setTotalItems(totalCount);
            setTotalPages(Math.ceil(totalCount / itemsPerPage));

            // Cập nhật danh sách phim
            if (Array.isArray(response.data)) {
                setMovies(response.data);
            } else if (response.data?.value) {
                setMovies(response.data.value);
            } else {
                setMovies([]);
            }

        } catch (error) {
            console.error('Lỗi khi tải danh sách phim:', error);
            setError('Có lỗi xảy ra khi tải danh sách phim');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        setCurrentPage(1);
        // không cần gọi fetchMovies() vì useEffect sẽ tự động gọi khi debouncedSearchTerm thay đổi
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedActor('');
        setSelectedGenre('');
        setReleaseYear('');
        setCurrentPage(1);
        // fetchMovies sẽ được gọi tự động khi các state thay đổi
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const renderPagination = () => {
        return (
            <div className="pagination-wrapper">
                <Stack spacing={2} alignItems="center">
                    <Pagination 
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: '#666',
                                '&.Mui-selected': {
                                    backgroundColor: '#e50914',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#cc0812',
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(229, 9, 20, 0.1)',
                                },
                            },
                        }}
                    />
                </Stack>
                {totalItems > 0 && (
                    <div className="pagination-info">
                        Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} trên {totalItems} phim
                    </div>
                )}
            </div>
        );
    };

    const MovieCard = ({ movie }) => {
        const releaseYear = new Date(movie.releaseDate).getFullYear();
        const randomRating = (Math.floor(Math.random() * 20) + 70) / 10; // Random rating between 7.0-9.0
        
        return (
            <div className="movie-card">
                <div className="movie-card-overlay">
                    <div className="movie-rating">
                        <FaStar /> {randomRating.toFixed(1)}
                    </div>
                    <div className="movie-image">
                        <img src={movie.image} alt={movie.movieName} />
                        <div className="movie-hover-info">
                            <div className="movie-quick-info">
                                <div><FaClock /> 120 phút</div>
                                <div>{releaseYear}</div>
                            </div>
                            <Link to={`/movie/${movie.movieId}`} className="btn-watch-now">
                                <FaPlay /> Xem ngay
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="movie-info">
                    <h3 title={movie.movieName}>{movie.movieName}</h3>
                    <div className="genres-badges">
                        {movie.genres.slice(0, 2).map(g => (
                            <Badge key={g.genreId} bg="secondary" className="genre-badge">
                                {g.name}
                            </Badge>
                        ))}
                        {movie.genres.length > 2 && (
                            <Badge bg="secondary" className="genre-badge genre-badge-more">
                                +{movie.genres.length - 2}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <div>Đang tải...</div>
        </div>
    );
    
    if (error) return <div className="error-container">{error}</div>;

    return (
        <Container fluid className="movie-list-container">
            <div className="movie-list-header">
                <h1 className="page-title">Khám phá phim</h1>
                <div className="filter-toggle-mobile">
                    <Button 
                        variant="outline-danger" 
                        onClick={toggleFilters}
                        className="filter-toggle-btn"
                    >
                        {showFilters ? <FaTimes /> : <FaFilter />} Bộ lọc
                    </Button>
                </div>
            </div>

            <Row>
                <Col lg={3} md={4} className={`filters-col ${showFilters ? 'show-filters' : ''}`}>
                    <div className="filters-sidebar">
                        <div className="filter-header">
                            <h4>Bộ lọc phim</h4>
                            <Button 
                                variant="link" 
                                className="filter-close" 
                                onClick={toggleFilters}
                            >
                                <FaTimes />
                            </Button>
                        </div>
                        
                        <div className="filter-section">
                            <h5>Tìm kiếm</h5>
                            <Form.Control
                                type="text"
                                placeholder="Tên phim..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mb-3"
                            />
                        </div>
                        
                        <div className="filter-section">
                            <h5>Diễn viên</h5>
                            <Form.Control
                                type="text"
                                placeholder="Tên diễn viên..."
                                value={selectedActor}
                                onChange={(e) => setSelectedActor(e.target.value)}
                                className="mb-3"
                            />
                        </div>
                        
                        <div className="filter-section">
                            <h5>Năm phát hành</h5>
                            <Form.Control
                                type="number"
                                placeholder="Năm phát hành..."
                                min="1900"
                                max={new Date().getFullYear()}
                                value={releaseYear}
                                onChange={(e) => setReleaseYear(e.target.value)}
                                className="mb-3"
                            />
                        </div>
                        
                        <div className="filter-section">
                            <h5>Thể Loại</h5>
                            <div className="filter-list">
                                {genres && genres.length > 0 ? genres.map(genre => (
                                    <Form.Check
                                        key={genre.genreId}
                                        type="checkbox"
                                        id={`genre-${genre.genreId}`}
                                        label={genre.name}
                                        checked={selectedGenre === genre.name}
                                        onChange={() => setSelectedGenre(selectedGenre === genre.name ? '' : genre.name)}
                                        className="genre-checkbox"
                                    />
                                )) : <p>Không có thể loại</p>}
                            </div>
                        </div>
                        
                        <div className="filter-actions">
                            <Button 
                                variant="danger" 
                                type="button" 
                                onClick={handleSearch}
                                className="w-100 mb-2"
                            >
                                <FaSearch /> Tìm kiếm
                            </Button>
                            <Button 
                                variant="outline-secondary" 
                                type="button" 
                                onClick={handleReset}
                                className="w-100"
                            >
                                <FaTimes /> Xóa bộ lọc
                            </Button>
                        </div>
                    </div>
                </Col>

                <Col lg={9} md={8}>
                    <div className="search-container-mobile">
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Tìm kiếm phim..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button 
                                variant="danger" 
                                onClick={handleSearch}
                            >
                                <FaSearch />
                            </Button>
                        </InputGroup>
                    </div>

                    {movies && movies.length > 0 ? (
                        <>
                            <div className="movies-container">
                                {movies.map(movie => (
                                    <MovieCard key={movie.movieId} movie={movie} />
                                ))}
                            </div>
                            
                            <div className="pagination-container">
                                {renderPagination()}
                            </div>
                        </>
                    ) : (
                        <div className="no-movies">
                            <FaTimes size={40} />
                            <h3>Không tìm thấy phim nào</h3>
                            <p>Vui lòng thử lại với các tiêu chí tìm kiếm khác</p>
                            <Button 
                                variant="outline-danger" 
                                onClick={handleReset}
                            >
                                Xóa bộ lọc
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default MovieList;
