import React, { useState } from "react";
import GenericTable from "../components/GenericTable"; 

const AdminShippingPage = () => {
  const [shippingData, setShippingData] = useState([
    // Placeholder data
    { id: 1, name: "Standard Shipping", cost: 5.0, duration: "3-5 days" },
    { id: 2, name: "Express Shipping", cost: 15.0, duration: "1-2 days" },
  ]);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Cost", accessor: "cost", render: (row) => `$${row.cost.toFixed(2)}` },
    { header: "Duration", accessor: "duration" },
  ];

  // const handleEdit = (row) => {
  //   alert(`Edit shipping method with ID: ${row.id}`);
  //   // Implement edit logic here
  // };

  // const handleDelete = (row) => {
  //   alert(`Delete shipping method with ID: ${row.id}`);
  //   // Implement delete logic here
  // };

  // // const handleAdd = () => {
  // //   alert("Add new shipping method");
  // //   // Implement add logic here
  // // };

  return (
    <div>
      <h1>Shipping Methods</h1>
      <GenericTable
        columns={columns}
        data={shippingData}
        // onEdit={handleEdit}
        // onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminShippingPage;