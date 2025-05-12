import React from "react"
import "../styles/AboutUs.css"
import CeoImage from "../assets/aboutusface.png" // Replace with the correct path to your image

const AboutUs = () => {
  return (
    <div className="ceo-wrapper">
      <div className="ceo-hero">
        <div className="ceo-text">
          <h1 className="ceo-title">FLAMOR</h1>
          <h2 className="ceo-subtitle">CEO</h2>
        </div>
        <div className="ceo-image-block">
          <img src={CeoImage} alt="CEO" className="ceo-image" />
        </div>
      </div>

      <div className="ceo-about">
        <h2>About</h2>
        <p className="subheading">
          Subheading for description or instructions
        </p>
        <p className="body-text">
          Body text for your whole article or post. We’ll put in some
          lorem ipsum to show how a filled-out page might look:
        </p>
        <p className="body-text">
          Excepteur efficient emerging, minim veniam anim aute carefully
          curated Ginza conversation exquisite perfect nostrud nisi
          intricate Content. Qui international first-class nulla ut.
          Punctual adipisicing, essential lovely queen tempor eiusmod
          irure. Exclusive izakaya charming Scandinavian impeccable aute
          quality of life soft power pariatur Melbourne occaecat
          discerning. Qui wardrobe aliquip, et Porter destination Toto
          remarkable officia Helsinki excepteur Basset hound. Zürich
          sleepy perfect consectetur.
        </p>
      </div>
    </div>
  )
}

export default AboutUs