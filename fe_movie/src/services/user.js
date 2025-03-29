import axiosInstance from "./axios";

const getUsers = async () => {
  const response = await axiosInstance  .get('/api/User');
  return response.data;
}


const UpdateActiveUser = async (id, isActive) => {
  const response = await axiosInstance.put(`/api/User/${id}/isActive`, isActive);
  return response.data;
}

const User_Service = {
  getUsers,
  UpdateActiveUser
}

export default User_Service;



