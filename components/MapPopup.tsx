import Image from "next/image"
import React, { ReactElement } from "react"
import { Marker } from "react-map-gl"
import styled from "styled-components"
import { Project } from "../pages"

const POPUP_WIDTH: number = 275
const POPUP_OFFSET: number = POPUP_WIDTH + 40

const PopupContainer = styled.div`
  display: grid;
  justify-items: center;
`

const ContentContainer = styled.div`
  width: ${POPUP_WIDTH}px;
  border: 2px solid black;
`

// Not sure why this needs to be position relative
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

const Line = styled.p`
  white-space: nowrap;
  overflow: hidden;
`

const Name = styled(Line)`
  font-size: 20px;
  text-overflow: ellipsis;
`

const TipContainer = styled.div`
  display: flex;
`

const TipBottom = styled.div`
  width: 0;
  height: 0;
  border-top: 25px solid black;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  position: absolute;
`

const TipTop = styled(TipBottom)`
  border-top: 25px solid white;
  position: relative;
  top: -2px;
`

const formatArchitects = (architects: string[]): string => {
  // Maximum number of characters that can fit on one line of popup
  // Depends on font size and character composition
  const MAX_LINE_LENGTH: number = 35

  // Truncate given string to given length, including trailing ellipsis
  const formatName = (name: string, length: number): string =>
    name.length <= length ? name : name.slice(0, length - 3) + "..."

  // Architect-less projects should be extremely rare
  if (architects.length === 0) {
    return "No Architects"
  }

  // For projects with one architect, show name of that architect
  if (architects.length === 1) {
    return formatName(architects[0], MAX_LINE_LENGTH)
  }

  // For projects with multiple architects, show name of first architect
  // and count of remaining architects
  return (
    formatName(architects[0], MAX_LINE_LENGTH - 10) +
    ` + ${architects.length - 1} More`
  )
}

interface MapPopupProps {
  project: Project
}

const MapPopup = ({ project }: MapPopupProps): ReactElement => (
  <Marker
    latitude={project.location.latitude}
    longitude={project.location.longitude}
    offsetLeft={POPUP_WIDTH / -2}
    offsetTop={-POPUP_OFFSET}
  >
    <PopupContainer>
      <ContentContainer>
        <ImageContainer>
          <Image src={`/${project.id}.jpg`} layout="fill" objectFit="cover" />
        </ImageContainer>
        <TextContainer>
          <Name>{project.name}</Name>
          <Line>{formatArchitects(project.architects)}</Line>
          <Line>{project.year}</Line>
        </TextContainer>
      </ContentContainer>
      <TipContainer>
        <TipBottom />
        <TipTop />
      </TipContainer>
    </PopupContainer>
  </Marker>
)

export default MapPopup
