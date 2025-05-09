import React from 'react';
import '../styles/ContactUs.css'; // we'll create this next
import Button from '../components/Button'

const ContactUs = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">CONTACT <span>US</span></h1>
        <form className="contact-form">
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