import axiosInstance from "./axiosInstance";

export const login = async (email, password) => {
  const response = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await axiosInstance.post("/api/auth/signup", {
    name,
    email,
    password,
  });
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/api/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/api/auth/me");
  return response.data;
};
