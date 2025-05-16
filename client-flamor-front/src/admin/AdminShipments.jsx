import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

const AdminShipments = () => {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await axiosInstance.get("/admin/shipments");
        setShipments(res.data.shipments);
      } catch (err) {
        console.error("Error fetching shipments", err);
      }
    };

    fetchShipments();
  }, []);

  return (
    <div className="admin-shipments">
      <h2>Shipments</h2>
      <table>
        <thead>
          <tr>
            <th>Shipment ID</th><th>Order ID</th><th>Address</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map(shipment => (
            <tr key={shipment.id}>
              <td>{shipment.id}</td>
              <td>{shipment.orderId}</td>
              <td>{shipment.address}</td>
              <td>{shipment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminShipments;