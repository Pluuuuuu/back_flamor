import React, { useEffect, useState } from "react";
import { fetchAllShippings } from "../api/shippingApi";
import { toast } from "react-toastify";

export default function ShippingList() {
  const [shippings, setShippings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShippings = async () => {
      try {
        const data = await fetchAllShippings();
        setShippings(data);
      } catch (err) {
        toast.error("Failed to fetch shippings");
      } finally {
        setLoading(false);
      }
    };
    loadShippings();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading shipping data...
      </div>
    );
  }

  if (shippings.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        No shipping data available.
      </div>
    );
  }

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">All Shippings</h2>
      <table className="w-full border border-gray-300 rounded-md">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3 border-b border-gray-300">Full Name</th>
            <th className="p-3 border-b border-gray-300">Phone</th>
            <th className="p-3 border-b border-gray-300">Address</th>
            <th className="p-3 border-b border-gray-300">City</th>
            <th className="p-3 border-b border-gray-300">Country</th>
            <th className="p-3 border-b border-gray-300">Postal Code</th>
          </tr>
        </thead>
        <tbody>
          {shippings.map((ship, index) => (
            <tr
              key={ship.id}
              className={
                index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-green-50"
              }
            >
              <td className="p-3 border-b border-gray-300">{ship.full_name}</td>
              <td className="p-3 border-b border-gray-300">{ship.phone}</td>
              <td className="p-3 border-b border-gray-300">{ship.address}</td>
              <td className="p-3 border-b border-gray-300">{ship.city}</td>
              <td className="p-3 border-b border-gray-300">{ship.country}</td>
              <td className="p-3 border-b border-gray-300">
                {ship.postal_code}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}