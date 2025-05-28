import React from "react";
import ShippingForm from "../components/ShippingForm";
import "../styles/ShippingForm.css"
export default function ShippingPage() {
  return (
    <div>
      <h1 className="text-center text-3xl my-4">Enter Shipping Details</h1>
      <ShippingForm />
    </div>
  );
}
