import axiosInstance from "../../app/utils/axiosinterceptor";

export const registrationService = {

  // 🔹 Get all classes
  getClasses: async () => {
    const response = await axiosInstance.get("/classes");
    return response.data;
  },

  // 🔹 Register Student
  registerStudent: async (data) => {
    const response = await axiosInstance.post("/students", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

};