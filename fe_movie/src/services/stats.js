import axiosInstance from "./axios";


const getTotalMoviesStats = async () => {
  const response = await axiosInstance.get('/api/Movies');
  return response.data;
}
const getTotalUsersStats = async () => {
  const response = await axiosInstance.get('/api/User');
  return response.data;
}

const getTotalGenresStats = async () => {
  const response = await axiosInstance.get('/odata/Genre');
  return response.data;
}

const getTotalActorsStats = async () => {
  const response = await axiosInstance.get('/api/Actor');
  return response.data;
}



const Stats_Service = {
  getTotalMoviesStats,
  getTotalUsersStats,
  getTotalGenresStats,
  getTotalActorsStats
}

export default Stats_Service;
