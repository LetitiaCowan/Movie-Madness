import { render } from "react-dom";
import React, { useState } from "react";
const Button = ({
  children = "",
  ...props
}) => {
  const [isActive, setIsActive] = useState(false);
  const baseStyle = {
    backgroundColor: isActive ? "#F7F7F7" : "#FFFFFF",
    border: isActive ? "1px solid #000000" : "1px solid #222222",
    borderColor: props.disabled ? "#DDDDDD" : isActive ? "#000000" : "#222222",
    borderRadius: "8px",
    boxSizing: "border-box",
    color: props.disabled ? "#DDDDDD" : "#222222",
    cursor: props.disabled ? "not-allowed" : "pointer",
    display: "inline-block",
    fontFamily: 'Circular,-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",sans-serif',
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "20px",
    margin: "0",
    outline: "none",
    padding: "13px 23px",
    position: "relative",
    textAlign: "center",
    textDecoration: "none",
    touchAction: "manipulation",
    transition: "box-shadow .2s, transform .1s",
    userSelect: "none",
    WebkitUserSelect: "none",
    width: "auto",
    transform: isActive ? "scale(.96)" : "none",
    opacity: props.disabled ? 1 : undefined
  };
  return <button className="absolute" {...props} style={baseStyle} role="button" onMouseDown={() => setIsActive(true)} onMouseUp={() => setIsActive(false)} onMouseLeave={() => setIsActive(false)}>
      Search
    </button>;
};
function ButtonContainer() {
  return <div style={{
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}>
      <Button>Search</Button>
    </div>;
}

export default Button;