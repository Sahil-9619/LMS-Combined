import axiosInstance from "../app/utils/axiosinterceptor";

export const admissionService = {

  // 🔹 Check Admission Status
  checkAdmission: async () => {
    try {
      const response = await axiosInstance.get("/admission/check");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  downloadInvoice: async (id) => {
  try {
    const response = await axiosInstance.get(`/invoice/download`, {
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
},

  
};