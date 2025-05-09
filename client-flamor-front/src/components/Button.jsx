import React from "react"
import "./Button.css" // Optional: for styling

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
      style={{ backgroundColor: backgroundColor, color: color }}
    >
      {children}
    </button>
  )
}

export default Button