import axiosInstance from "./axios";

const GetAllGenre = async (filter = "", skip = 0, top = 10) => {
    try {
      const response = await axiosInstance.get(`/odata/Genre?$top=${top}&$skip=${skip}${filter}`);
      return response;
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw error;
    }
  };
  


const GetGenreById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/Genre/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching genre with ID ${id}:`, error);
        throw error;
    }
};

const CreateGenre = async (data) => {
    try {
        const response = await axiosInstance.post("/api/Genre", data);
        return response.data;
    } catch (error) {
        console.error("Error creating genre:", error);
        throw error;
    }
};

const UpdateGenre = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/api/Genre/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating genre with ID ${id}:`, error);
        throw error;
    }
};

const DeleteGenre = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/Genre/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting genre with ID ${id}:`, error);
        throw error;
    }
};

const Genre_Services = {
    GetAllGenre,
    GetGenreById,
    CreateGenre,
    UpdateGenre,
    DeleteGenre
};

export default Genre_Services;
