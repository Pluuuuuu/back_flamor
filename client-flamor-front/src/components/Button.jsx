import React from "react"
import "./Button.css" // Optional: for styles

const Button = ({
  children,
  className,
  backgroundColor = "#d991a4",
  color = "white",
}) => {
  return (
    <button
      id="Btn"
      className={className}
      styles={{ backgroundColor: backgroundColor, color: color }}
    >
      {children}
    </button>
  )
}

export default Button