import { create } from "domain";
import axiosInstance from "../../app/utils/axiosinterceptor";
import { get } from "http";

export const adminServices = {
  // Get all courses
  //   instructorProfile: async (params) => {
  //     const response = await axiosInstance.get(
  //       `/admin/get-instructor-profile/${params}`
  //     );
  //     return response.data;
  //   },

  getDashborddata: async () => {
    const response = await axiosInstance.get(`/admin/dashboard`);
    return response.data;
  },
  getAllUsers: async (params = {}) => {
    const response = await axiosInstance.get(`/admin/users`, { params });
    return response.data;
  },
  getUserById: async (id) => {
    const response = await axiosInstance.get(`/admin/users/${id}`);
    return response.data;
  },
  createUser: async (data) => {
    const response = await axiosInstance.post(`/admin/users`, data);
    return response.data;
  },
  updateUser: async (id, data) => {
    const response = await axiosInstance.put(`/admin/users/${id}`, data);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/admin/users/${id}`);
    return response.data;
  },
  createStudent: async (data) => {
    const response = await axiosInstance.post(`/students`, data);
    return response.data;
  },
  getAllClasses: async () => {
    const response = await axiosInstance.get(`/class`);
    return response.data;
  },
  createClass: async (data) => {
    const response = await axiosInstance.post(`/class`, data);
    return response.data;
  },
  getClassById: async (id) => {
    const response = await axiosInstance.get(`/class/${id}`);
    return response.data;
  },  
  updateClass: async (id, data) => {
    const response = await axiosInstance.put(`/class/${id}`, data);
    return response.data;
  },
  deleteClass: async (id) => {
    const response = await axiosInstance.delete(`/class/${id}`);
    return response.data;
  },  

  getstudentsByClass: async (classId) => {
    const response = await axiosInstance.get(`/students/class/${classId}`);
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await axiosInstance.get(`/students/${id}`);
    return response.data;
  },
   
  getUserWithStudentCheck: async (id) => {
    const response = await axiosInstance.get(`/admin/user-with-student/${id}`);
    return response.data;
  },

};
