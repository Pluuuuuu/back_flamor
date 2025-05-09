import "../styles/Home.css"
import modelImage from "../assets/model.png"
import circles from "../assets/CIRCLES.png"
import ellipse from "../assets/EllipseS.svg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import Button from "../components/Button"

export default function Home() {
  return (
    <section className="korean-container">
      <h3 className="add-sparkle">ADD THE SPARKLE</h3>
      <h1 className="title">FLAMORY</h1>
      <Button className="pinkBtn">Steal the Look</Button>
      <Button
        className="lightBtn"
        backgroundColor="#f2e0df"
        color="#d991a4"
      >
        Learn More
      </Button>
      <button id="vertical-btn">FASHIONABLE</button>
      <button id="arrow-btn">
        <FontAwesomeIcon icon={faArrowRight} />
      </button>

      <div id="pink-square-behind"></div>
      <img src={modelImage} alt="Model" className="model-image" />
      <img src={circles} alt="circles" className="circles-image" />
      <img src={ellipse} alt="ellipse" className="ellipse-image" />

      <p className="ellipse-txt bags">BAGS</p>
      <p className="ellipse-txt necklaces">NECKLACES</p>
      <p className="ellipse-txt earings">EARINGS</p>
      <p className="ellipse-txt rings">RINGS</p>
    </section>
  )
}