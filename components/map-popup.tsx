import Image from "next/image"
import React, { useCallback, useState } from "react"
import { Marker } from "react-map-gl"
import styled from "styled-components"
import { Project } from "../pages"

const POPUP_WIDTH = 275
const POPUP_OFFSET = POPUP_WIDTH + 40

const TipContainer = styled.div`
  display: grid;
  justify-items: center;
`

const PopupContainer = styled.div`
  width: ${POPUP_WIDTH}px;
  border: 2px solid black;
`

// Still not sure why this needs to be position: relative
const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 175px;
`

const TextContainer = styled.div`
  width: 100%;
  padding: 10px;
  border-top: 2px solid black;
  background-color: white;
  display: grid;
  grid-gap: 5px;
`

const Name = styled.p`
  font-size: 20px;
`

const Tip = styled.div`
  width: 0;
  height: 0;
  border-top: 25px solid black;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
`

const TipMask = styled(Tip)`
  position: relative;
  top: -27px;
  border-top: 25px solid white;
`

const Detail = styled.p``

interface MapPopupProps {
  project: Project
}

const MapPopup = ({ project }: MapPopupProps) => (
  <Marker
    latitude={project.location.latitude}
    longitude={project.location.longitude}
    offsetLeft={POPUP_WIDTH / -2}
    offsetTop={-POPUP_OFFSET}
  >
    <TipContainer>
      <PopupContainer>
        <ImageContainer>
          <Image src={`/${project.id}.jpg`} layout="fill" objectFit="cover" />
        </ImageContainer>
        <TextContainer>
          <Name>{project.name}</Name>
          <Detail>{project.architects.join(" + ")}</Detail>
          <Detail>{project.year}</Detail>
        </TextContainer>
      </PopupContainer>
      <Tip />
      <TipMask />
    </TipContainer>
  </Marker>
)

export default MapPopup
