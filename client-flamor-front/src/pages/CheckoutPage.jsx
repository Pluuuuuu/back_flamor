import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/checkout.css';

const CheckoutPage = () => {
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    phone: '',
    city: '',
    postalCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod or wish
  const [wishBalance, setWishBalance] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCartTotal();
    fetchWishBalance();
  }, []);

  const fetchCartTotal = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cart', { withCredentials: true });
      setCartTotal(res.data.total);
    } catch (err) {
      console.error('Error fetching cart total:', err);
    }
  };

  const fetchWishBalance = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/balance', { withCredentials: true });
      setWishBalance(res.data.balance);
    } catch (err) {
      console.error('Error fetching wish money balance:', err);
    }
  };

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.phone || !shippingInfo.city || !shippingInfo.postalCode) {
      setMessage('Please fill in all shipping information.');
      return;
    }

    if (paymentMethod === 'wish' && wishBalance < cartTotal) {
      setMessage('Insufficient Wish Money balance.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/order', {
        shippingInfo,
        paymentMethod
      }, { withCredentials: true });

      setMessage('✅ Order placed successfully!');
    } catch (err) {
      console.error('Error placing order:', err);
      setMessage('❌ Failed to place order.');
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <h2>Shipping Information</h2>
      <div className="shipping-form">
        {['name', 'address', 'phone', 'city', 'postalCode'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={shippingInfo[field]}
            onChange={handleChange}
            required
          />
        ))}
      </div>

      <h2>Payment Method</h2>
      <div className="payment-options">
        <label>
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Pay on Delivery
        </label>

        <label>
          <input
            type="radio"
            value="wish"
            checked={paymentMethod === 'wish'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Pay with Wish Money (${wishBalance.toFixed(2)})
        </label>
      </div>

      <h3>Total: ${cartTotal.toFixed(2)}</h3>

      <button className="place-order-btn" onClick={placeOrder}>
        Place Order
      </button>

      {message && <p className="order-message">{message}</p>}
    </div>
  );
};

export default CheckoutPage;
