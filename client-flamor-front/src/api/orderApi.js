import axios from "./axiosInstance";

// Fetch all orders (admin)
export const fetchAllOrders = async (token) => {
  const response = await axios.get("/api/orders", {
    withCredentials: true,
  });
  return response.data;
};

// Fetch orders for the logged-in customer
export const fetchCustomerOrders = async (token) => {
  const response = await axios.get("/api/orders/my", {
    withCredentials: true,
  });
  return response.data;
};


// export const placeOrder = async (orderData) => {
//   const response = await axios.post("/api/orders", orderData, {
//     withCredentials: true,
//   });
//   return response.data;
// };

export const placeOrder = async (orderPayload) => {
  const response = await axios.post("/api/orders", orderPayload, {
    withCredentials: true,
  });
  return response.data;
};


export const updateOrderStatus = async ( orderId, status ) => {
  const response = await axios.patch(
    `/api/orders/${orderId}/status`,
    { status },
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export const deleteOrder = async ( orderId ) => {
  const response = await axios.delete(`/api/orders/${orderId}`, {
    withCredentials: true,
  });
  return response.data;
};