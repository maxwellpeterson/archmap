import React, { useState } from "react"
import styled from "styled-components"
import ReactMapGL from "react-map-gl"
import "fontsource-inter/600.css"

const Container = styled.div`
  display: grid;
  justify-items: center;
`

const HeaderBackground = styled.div`
  position: fixed;
  z-index: 999;
`

const Header = styled.h1`
  font-family: Inter;
  font-size: 50px;
  letter-spacing: -0.05em;
`

function Home({ mapboxToken }) {
  const [viewport, setViewport] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    width: "100vw",
    height: "100vh",
    zoom: 10,
  })

  return (
    <Container>
      <HeaderBackground>
        <Header>ArchMap</Header>
      </HeaderBackground>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={mapboxToken}
        onViewportChange={setViewport}
      ></ReactMapGL>
    </Container>
  )
}

// Not sure this is the best way to handle the mapbox key...
export async function getStaticProps(context) {
  return {
    props: { mapboxToken: process.env.MAPBOX_TOKEN },
  }
}

export default Home
