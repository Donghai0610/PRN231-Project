import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import jwt_decode, { jwtDecode } from "jwt-decode";
import Header from "./Components/pages/Header";
import Footer from "./Components/pages/Footer";
import CinemaInfo from "./Components/pages/CinemaInfo";
import TicketPricing from "./Components/pages/TicketPricing";
import LoginRegister from "./Components/pages/LoginRegister.js";
import LanguagesManager from "./Components/AdminPage/AdminDashBoard.js";
import GenresManager from "./Components/AdminPage/GenresManager.js";
import Page404 from "./Components/pages/Page404.js";
import HomePage from "./Components/pages/HomePage.js";
import MovieDetail from "./Components/pages/MovieDetail.js";
import AccountManager from "./Components/AdminPage/AccountManager.js";
import ShowTime from "./Components/pages/ShowtimePage.js";
import Booking from "./Components/pages/Booking.js";
import UserProfile from "./Components/pages/UserProfile.js";
import { ToastContainer } from "react-toastify";
import AdminSidebar from "./Components/pages/AdminSidebar.js";
import BlogManagement from "./Components/AdminPage/BlogManagement.js";
import ActorManagement from "./Components/AdminPage/ActorManagement.js";
import MovieManagement from "./Components/AdminPage/MovieManagement.js";
import AdminDashBoard from "./Components/AdminPage/AdminDashBoard.js";

// PrivateRoute component to handle authentication for all routes
function PrivateRoute({ element, allowedRoles }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token");
      return <Navigate to="/login" />;
    }
    if (!allowedRoles.includes(decodedToken.role)) {
      return <Navigate to="/login" />;
    }
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
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

        {/* Admin Layout with Sidebar */}
        <Route
          path="/admin"
          element={<PrivateRoute element={<AdminSidebar />} allowedRoles={["Admin"]} />}
        >
           <Route
            path="dashboard"
            element={<PrivateRoute element={<AdminDashBoard />} allowedRoles={["Admin"]} />}
          />
          <Route
            path="movies"
            element={<PrivateRoute element={<MovieManagement />} allowedRoles={["Admin"]} />}
          />
          <Route
            path="languages"
            element={<PrivateRoute element={<LanguagesManager />} allowedRoles={["Admin"]} />}
          />
          <Route
            path="genres"
            element={<PrivateRoute element={<GenresManager />} allowedRoles={["Admin"]} />}
          />
          <Route
            path="actors"
            element={<PrivateRoute element={<ActorManagement />} allowedRoles={["Admin"]} />}
          />
          <Route
            path="account"
            element={<PrivateRoute element={<AccountManager />} allowedRoles={["Admin"]} />}
          />
          <Route
            path="blog"
            element={<PrivateRoute element={<BlogManagement />} allowedRoles={["Admin"]} />}
          />
             <Route
            path="blog"
            element={<PrivateRoute element={<BlogManagement />} allowedRoles={["Admin"]} />}
          />
        </Route>


        {/* Other Public Routes */}
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
          path="/booking/:id"
          element={<PrivateRoute element={<Booking />} allowedRoles={["Admin", "Customer"]} />}
        />
        <Route
          path="/profile/:id"
          element={<PrivateRoute element={<UserProfile />} allowedRoles={["Admin", "Customer"]} />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
