import React from 'react';
import '../styles/ContactUs.css';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.info('This feature is still under construction.');
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">CONTACT <span>US</span></h1>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First name</label>
              <input type="text" placeholder="Jane" />
            </div>
            <div className="form-group">
              <label>Last name</label>
              <input type="text" placeholder="Smitherton" />
            </div>
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" placeholder="email@janesfakedomain.net" />
          </div>
          <div className="form-group">
            <label>Your message</label>
            <textarea placeholder="Enter your question or message" rows="4" />
          </div>
          <Button className="sendButton" type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
