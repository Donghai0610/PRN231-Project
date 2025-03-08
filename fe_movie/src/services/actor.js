import axiosInstance from "./axios";

const GetAllActors = async (page, pageSize, search) => {
    try {
        const response = await axiosInstance.get(`/api/Actor`, {
            params: {
                Page: page,
                PageSize: pageSize,
                Search: search
            }
        });
        
        // Trả về dữ liệu nhận được từ API
        return response.data;

    } catch (error) {
        console.error("Error fetching actors:", error);
        throw error;
    }
}

const GetActorById = async (actorId) => {
    try {
        const response = await axiosInstance.get(`/api/Actor/${actorId}`);
        return response.data;  // Trả về dữ liệu của diễn viên
    } catch (error) {
        console.error("Error fetching actor:", error);
        throw error;
    }
};
const AddActor = async (fullName, bio, birthDate, image) => {
    const formData = new FormData();
    formData.append("FullName", fullName);
    formData.append("Bio", bio);
    formData.append("BirthDate", birthDate);
    if (image) formData.append("Image", image);  

    try {
        const response = await axiosInstance.post("/api/Actor", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // Đảm bảo là multipart/form-data
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding actor:", error);
        throw error;
    }
};
const UpdateActor = async (actorId, fullName, bio, birthDate, image) => {
    const formData = new FormData();
    formData.append("FullName", fullName);
    formData.append("Bio", bio);
    formData.append("BirthDate", birthDate);
    formData.append("ActorId", actorId);  // Thêm ActorId vào formData
    if (image) formData.append("Image", image);

    try {
        const response = await axiosInstance.put(`/api/Actor/${actorId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating actor:", error);
        throw error;
    }
};
const DeleteActor = async (actorId) => {
    try {
        const response = await axiosInstance.delete(`/api/Actor/${actorId}`);
        return response.data;  // Trả về dữ liệu sau khi xóa
    } catch (error) {
        console.error("Error deleting actor:", error);
        throw error;
    }
};
const Actor_Service = {
    GetAllActors,
    GetActorById,
    AddActor,
    UpdateActor,
    DeleteActor

};

export default Actor_Service;