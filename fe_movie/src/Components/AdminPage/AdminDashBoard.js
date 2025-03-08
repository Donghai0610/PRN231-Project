import React from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material";

// Sử dụng react-chartjs-2
import { Pie, Bar } from "react-chartjs-2";  {/* Đưa lên đầu */}

// Đăng ký các thành phần cho chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);


const AdminDashboard = () => {
  // Dữ liệu thống kê mock
  const totalMovies = 123;
  const totalUsers = 456;
  const totalGenres = 10;
  const totalActors = 999;

  // Dữ liệu Pie Chart: tỉ lệ phim theo thể loại
  // Ở đây là ví dụ 4 thể loại
  const pieData = {
    labels: ["Hành động", "Hài", "Tình cảm", "Kinh dị"],
    datasets: [
      {
        label: "Số lượng phim",
        data: [40, 30, 20, 10], // Ví dụ
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  // Dữ liệu Bar Chart: lượt xem phim theo tháng
  const barData = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Lượt xem (triệu)",
        data: [3, 2, 5, 1, 6, 4, 8, 9, 7, 6, 10, 12], // ví dụ
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Lượt xem phim theo tháng",
      },
    },
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Grid cho bốn card tổng quan */}
      <Grid container spacing={2}>
        {/* Tổng phim */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <Typography variant="h6">Tổng phim</Typography>
              <Typography variant="h4" color="primary">
                {totalMovies}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tổng user */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <Typography variant="h6">Tổng người dùng</Typography>
              <Typography variant="h4" color="primary">
                {totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tổng thể loại */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <Typography variant="h6">Tổng thể loại</Typography>
              <Typography variant="h4" color="primary">
                {totalGenres}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tổng diễn viên */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <Typography variant="h6">Tổng diễn viên</Typography>
              <Typography variant="h4" color="primary">
                {totalActors}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Biểu đồ */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Pie Chart: phim theo thể loại */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Phim theo thể loại
              </Typography>
              <Pie data={pieData} options={pieOptions} />
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart: lượt xem phim theo tháng */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lượt xem phim theo tháng
              </Typography>
              <Bar data={barData} options={barOptions} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
