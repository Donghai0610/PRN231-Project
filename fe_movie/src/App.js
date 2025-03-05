import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import jwt_decode, { jwtDecode } from "jwt-decode"; // For decoding the JWT
import Header from "./Components/pages/Header";
import Footer from "./Components/pages/Footer";
import CinemaInfo from "./Components/pages/CinemaInfo";
import TicketPricing from "./Components/pages/TicketPricing";
import LoginRegister from "./Components/pages/LoginRegister.js";
import AdminMovies from "./Components/AdminPage/AdminMovies.js";
import MoviePage from "./Components/pages/MoviePage.js";
import LanguagesManager from "./Components/AdminPage/LanguagesManager.js";
import GenresManager from "./Components/AdminPage/GenresManager.js";
import MovieTypesManager from "./Components/AdminPage/MovieTypesManager.js";
import ScreensManager from "./Components/AdminPage/ScreensManager.js";
import Page404 from "./Components/pages/Page404.js";
import HomePage from "./Components/pages/HomePage.js";
import MovieDetail from "./Components/pages/MovieDetail.js";
import AccountManager from "./Components/AdminPage/AccountManager.js";
import ShowTime from "./Components/pages/ShowtimePage.js";
import Booking from "./Components/pages/Booking.js";
import UserProfile from "./Components/pages/UserProfile.js";
import TicketManagement from "./Components/AdminPage/TicketManagement.js";
import { ToastContainer } from "react-toastify";

// PrivateRoute component to handle authentication for all routes
function PrivateRoute({ element, allowedRoles }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />; // Redirect to login if no token
  }

  // Optional: Decode token to check for expiration or other conditions
  try {
    const decodedToken = jwtDecode(token); // Decode the JWT token
    const currentTime = Date.now() / 1000; // Get current time in seconds
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token"); // Remove expired token
      return <Navigate to="/login" />; // Redirect to login if token is expired
    }
    // Check if the user role matches the allowedRoles
    if (!allowedRoles.includes(decodedToken.role)) {
      return <Navigate to="/login" />; // Redirect to login if role is not allowed
    }
  } catch (error) {
    localStorage.removeItem("token"); // Invalid token, remove it
    return <Navigate to="/login" />; // Redirect to login if invalid token
  }

  return element; 
}

function App() {
  return (
    <Router>
      <Header />
      <ToastContainer />
      <Routes>
        {/* Public Route: Login/Register */}
        <Route path="/login" element={<LoginRegister />} />

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<Page404 />} />

        {/* All other routes are wrapped with PrivateRoute to ensure authentication */}
        <Route
          path="/"
          element={<PrivateRoute element={<HomePage />} allowedRoles={["Admin", "Customer"]} />}
        />
        <Route
          path="/movie/:id"
          element={<PrivateRoute element={<MovieDetail />} allowedRoles={["Admin", "Customer"]} />}
        />
        <Route
          path="/info"
          element={<PrivateRoute element={<CinemaInfo />} allowedRoles={["Admin", "Customer"]} />}
        />
        <Route
          path="/price"
          element={<PrivateRoute element={<TicketPricing />} allowedRoles={["Admin", "Customer"]} />}
        />
        <Route
          path="/showtime"
          element={<PrivateRoute element={<ShowTime />} allowedRoles={["Admin", "Customer"]} />}
        />
        <Route
          path="/movie"
          element={<PrivateRoute element={<MoviePage />} allowedRoles={["Admin", "Customer"]} />}
        />
        <Route
          path="/account"
          element={<PrivateRoute element={<AccountManager />} allowedRoles={["Admin"]} />}
        />
        <Route
          path="/managermovies"
          element={<PrivateRoute element={<AdminMovies />} allowedRoles={["Admin"]} />}
        />
        <Route
          path="/languages"
          element={<PrivateRoute element={<LanguagesManager />} allowedRoles={["Admin"]} />}
        />
        <Route
          path="/genres"
          element={<PrivateRoute element={<GenresManager />} allowedRoles={["Admin"]} />}
        />
        <Route
          path="/movietypes"
          element={<PrivateRoute element={<MovieTypesManager />} allowedRoles={["Admin"]} />}
        />
        <Route
          path="/screens"
          element={<PrivateRoute element={<ScreensManager />} allowedRoles={["Admin"]} />}
        />
        <Route
          path="/booking/:id"
          element={<PrivateRoute element={<Booking />} allowedRoles={["Admin", "Customer"]} />}
        />
        <Route
          path="/profile/:id"
          element={<PrivateRoute element={<UserProfile />} allowedRoles={["Admin", "Customer"]} />}
        />
        <Route
          path="/tickets"
          element={<PrivateRoute element={<TicketManagement />} allowedRoles={["Admin"]} />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
