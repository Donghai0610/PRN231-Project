import React, { useState } from 'react';
import { Sidebar as ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FaBars, FaFilm, FaUser, FaBlog, FaTags, FaTicketAlt } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';
import '../../CSS/AdminSidebar.css';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: '400px' }}>
      <ProSidebar collapsed={collapsed} transitionDuration={1000}>
        <Menu>
        <MenuItem 
            icon={<FaTicketAlt />} 
            className={activeItem === "dashboard" ? "active-sidebar-item" : ""}
            onClick={() => handleItemClick("tickets")}
          >
            <Link to="dashboard" className="sidebar-link">Quản lý Chung</Link>
          </MenuItem>
          <MenuItem 
            icon={<FaTags />} 
            className={activeItem === "genres" ? "active-sidebar-item" : ""}
            onClick={() => handleItemClick("genres")}
          >
            <Link to="genres" className="sidebar-link">Quản lý Thể loại</Link>
          </MenuItem>
          <MenuItem 
            icon={<FaFilm />} 
            className={activeItem === "movies" ? "active-sidebar-item" : ""}
            onClick={() => handleItemClick("movies")}
          >
            <Link to="movies" className="sidebar-link">Quản lý Phim</Link>
          </MenuItem>
          <MenuItem 
            icon={<FaUser />} 
            className={activeItem === "actors" ? "active-sidebar-item" : ""}
            onClick={() => handleItemClick("actors")}
          >
            <Link to="actors" className="sidebar-link">Quản lý Diễn viên</Link>
          </MenuItem>
          <MenuItem 
            icon={<FaUser />} 
            className={activeItem === "account" ? "active-sidebar-item" : ""}
            onClick={() => handleItemClick("account")}
          >
            <Link to="account" className="sidebar-link">Quản lý Người dùng</Link>
          </MenuItem>
          <MenuItem 
            icon={<FaBlog />} 
            className={activeItem === "blog" ? "active-sidebar-item" : ""}
            onClick={() => handleItemClick("blog")}
          >
            <Link to="blog" className="sidebar-link">Quản lý Blog</Link>
          </MenuItem>
         
         
        </Menu>
      </ProSidebar>

      <main style={{ flex: 1, padding: 10 }}>
        <div>
          <button
            className="sb-button"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            <FaBars />
          </button>
        </div>
        {/* Đây là nơi render các route con */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminSidebar;
