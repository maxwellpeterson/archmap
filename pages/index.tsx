import dynamic from "next/dynamic"
import React from "react"
import styled from "styled-components"
import "fontsource-inter/400.css"

const Background = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  justify-items: center;
`

const Content = styled.div`
  max-width: 1250px;
`

const Heading = styled.h1`
  font-family: Inter;
  font-size: 75px;
  letter-spacing: -5px;
`

const Home = () => {
  // Taken from stackoverflow.com/a/64634759
  // Leaflet only works in the browser, can't be rendered server-side
  // nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
  const Map = dynamic(() => import("../components/map"), { ssr: false })

  return (
    <Background>
      <Content>
        <Heading>ArchMap</Heading>
        <Map />
      </Content>
    </Background>
  )
}

export default Home
