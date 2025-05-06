import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
      <Link to="/shop" style={{ marginRight: '10px' }}>Shop</Link>
      <Link to="/about" style={{ marginRight: '10px' }}>About Us</Link>
      <Link to="/contact" style={{ marginRight: '10px' }}>Contact Us</Link>
      <Link to="/cart" style={{ marginRight: '10px' }}>Cart</Link>
      <Link to="/profile" style={{ marginRight: '10px' }}>Profile</Link>
      {/* <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
      <Link to="/signup">Signup</Link> */}
      <Link to="/authform">AuthForm</Link>
    </nav>
  );
};

export default Navbar;
