import React from "react";
import styled from "styled-components";
import CurrentTrack from "./CurrentTrack";

import PlayerControls from "./PlayerControls";
import Volume from "./Volume";

function Footer() {
  return (
    <Container>
      <CurrentTrack />
      <PlayerControls />
      <Volume />
    </Container>
  );
}

export default Footer;

const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: #191414;
  border-top: 2px solid #353535;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
`;
