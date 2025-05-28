// configures the generic table specifically for orders, keeping the generic component clean and focused.
import React from "react";
import GenericTable from "./GenericTable";

const OrdersTable = ({ orders, onEdit, onDelete, onAdd }) => {
  const columns = [
    { header: "Order ID", accessor: "id" },
    {
      header: "Total Amount",
      accessor: "total_amount",
      render: (row) => `$${Number(row.total_amount).toFixed(2)}`,
    },
    { header: "Status", accessor: "status" },
    {
      header: "Created At",
      accessor: "created_at",
      render: (row) => new Date(row.created_at).toLocaleString(),
    },
    {
      header: "Shipping Address",
      accessor: "Shipping",
      render: (row) =>
        row.Shipping
          ? `${row.Shipping.address}, ${row.Shipping.city}, ${row.Shipping.country}, ${row.Shipping.postal_code}`
          : "N/A",
    },
    {
      header: "Payment Method",
      accessor: "Payment",
      render: (row) => (row.Payment ? row.Payment.payment_method : "N/A"),
    },
    // { header: 'Payment Status', accessor: 'Payment', render: (row) => (row.Payment ? row.Payment.status : 'N/A') },
    {
      header: "Order Items",
      accessor: "OrderItems",
      render: (row) =>
        row.OrderItems && row.OrderItems.length > 0 ? (
          <ul>
            {row.OrderItems.map((item) => (
              <li key={item.id}>
                {item.Product ? item.Product.name : "Product"} - Qty:{" "}
                {item.quantity} - Price: ${Number(item.price).toFixed(2)}
              </li>
            ))}
          </ul>
        ) : (
          <span>No items</span>
        ),
    },
  ];

  return (
    <GenericTable
      columns={columns}
      data={orders}
      onEdit={onEdit}
      onDelete={onDelete}
      // onAdd={onAdd}
    />
  );
};

export default OrdersTable;
