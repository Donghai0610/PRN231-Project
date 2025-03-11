import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import jwt_decode, { jwtDecode } from "jwt-decode";
import Header from "./Components/pages/Header";
import Footer from "./Components/pages/Footer";
import LoginRegister from "./Components/pages/LoginRegister.js";
import LanguagesManager from "./Components/AdminPage/AdminDashBoard.js";
import GenresManager from "./Components/AdminPage/GenresManager.js";
import Page404 from "./Components/pages/Page404.js";
import HomePage from "./Components/pages/HomePage.js";
import MovieDetail from "./Components/pages/MovieDetail.js";
import AccountManager from "./Components/AdminPage/AccountManager.js";
import UserProfile from "./Components/pages/UserProfile.js";
import { ToastContainer } from "react-toastify";
import AdminSidebar from "./Components/pages/AdminSidebar.js";
import BlogManagement from "./Components/AdminPage/BlogManagement.js";
import ActorManagement from "./Components/AdminPage/ActorManagement.js";
import MovieManagement from "./Components/AdminPage/MovieManagement.js";
import AdminDashBoard from "./Components/AdminPage/AdminDashBoard.js";
import AddBlog from "./Components/AdminPage/component/AddBlog.js";
import UpdateBlog from "./Components/AdminPage/component/UpdateBLog.js";
import MovieList from "./Components/pages/MovieList.js";
import BlogReview from "./Components/pages/BlogReview.js";
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
          <Route
            path="add-blog"
            element={<PrivateRoute element={<AddBlog />} allowedRoles={["Admin"]} />}
          />
          <Route
            path="update-blog/:id"
            element={<PrivateRoute element={<UpdateBlog  />} allowedRoles={["Admin"]} />}
          />
      
        </Route>
       
        {/* <Route
            path="/add-blog"
            element={<PrivateRoute element={<AddBlog />} allowedRoles={["Admin"]} />}
          /> */}
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
          path="/movie"
          element={<PrivateRoute element={<MovieList />} allowedRoles={["Admin", "Customer"]} />}
        />
        <Route
          path="/blog-review"
          element={<PrivateRoute element={<BlogReview />} allowedRoles={["Admin", "Customer"]} />}
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
