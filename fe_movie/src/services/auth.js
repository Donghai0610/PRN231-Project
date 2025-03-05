import axiosInstance from "./axios";



const loginHandle = async (userName, password) => {
    try {
        const response = await axiosInstance.post(
            '/api/account/login', 
            { userName, password }
        );

        if (response.status === 200) {
            return response.data; // Successful login, return data
        } else if (response.status === 401) {
            throw new Error(response.data.message || 'Unauthorized: Account not activated');
        } else {
            throw new Error(response.data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error.response?.data || error.message);
        throw error;  // Throwing the error with full details
    }
};


const register = async (userName, password, email) => {
    try {
        const response = await axiosInstance.post(
            '/api/account/register',
            { userName, password, email }
        );

        if (response.status === 200) {
            return response.data; // Successful registration, return data
        } else {
            // This should generally not be reached as the error is handled in the catch block.
            throw new Error(response.data.message || 'Registration failed');
        }
    } catch (error) {
        // Check if the error response is from the server and contains error codes
        if (error.response && error.response.data) {
            const errorData = error.response.data;
            const errorMessages = errorData.map(err => err.description).join(', ');
            throw new Error(errorMessages); // Throw a new error with the message(s)
        } else {
            // If no response data is available, throw a generic error message
            throw new Error(error.response?.data?.message || error.message || 'An unexpected error occurred');
        }
    }
};




const Auth_Services ={
    loginHandle,
    register
}
export default Auth_Services;