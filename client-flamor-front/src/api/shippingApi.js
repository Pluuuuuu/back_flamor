import axiosInstance from "./axiosInstance";

// Using axiosInstance which has withCredentials: true to send cookies/tokens automatically

export const createShipping = async (shippingData) => {
  const res = await axiosInstance.post("/api/shipping", shippingData, {
    withCredentials: true,
  });
  return res.data.shipping;
};
// admin can fetch all shippings
export const fetchAllShippings = async () => {
  const res = await axiosInstance.get("/api/shipping", {
    withCredentials: true,
  });
  return res.data;
};
