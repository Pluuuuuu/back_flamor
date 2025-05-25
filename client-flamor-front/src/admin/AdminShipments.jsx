// import React, { useEffect, useState } from 'react';

// const AdminShipments = () => {
//   const [shipments, setShipments] = useState([]);

//   useEffect(() => {
//     const fetchShipments = async () => {
//       try {
//         const res = await fetch('/api/shipments');
//         const data = await res.json();
//         setShipments(data);
//       } catch (err) {
//         console.error('Failed to fetch shipments:', err);
//       }
//     };

//     fetchShipments();
//   }, []);

//   return (
//     <div className="admin-shipments">
//       <h2>Shipments</h2>
//       {shipments.length === 0 ? (
//         <p>No shipments found.</p>
//       ) : (
//         <ul>
//           {shipments.map((shipment) => (
//             <li key={shipment.id}>
//               <strong>Order ID:</strong> {shipment.orderId}<br />
//               <strong>Status:</strong> {shipment.status}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default AdminShipments;
import React from 'react';

const AdminShipments = () => {
  return (
    <div className="admin-shipments">
      <h2>Shipments</h2>
    </div>
  );
};

export default AdminShipments;
