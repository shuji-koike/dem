import React from "react";
import styled from "styled-components";

export const MapView: React.FC<{
  name: string;
}> = function({ name }) {
  return <StyledImage src={"/static/maps/" + name + "_radar.png"} />;
};

const StyledImage = styled.img`
  filter: grayscale(75%) brightness(50%);
`;
