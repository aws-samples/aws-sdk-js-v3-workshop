import React from "react";

const textStyle = {
  color: "transparent",
  textShadow: "0 0 5px rgba(0,0,0,0.5)"
};

const BlurredText = (props: { text: string }) => (
  <div style={textStyle}>{props.text}</div>
);

export default BlurredText;
