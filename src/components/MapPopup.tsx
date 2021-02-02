import Image from "next/image"
import Link from "next/link"
import React, { ReactElement } from "react"
import { Marker } from "react-map-gl"
import styled from "styled-components"
import { Project } from "../types"

const POPUP_WIDTH: number = 275
// Warning: This height is observed, and may change with styling
const POPUP_HEIGHT: number = 295

// Popup = Content + Tip
const PopupContainer = styled.div`
  display: grid;
  justify-items: center;
`
// Content = Image + Text
const ContentContainer = styled.div`
  width: ${POPUP_WIDTH}px;
  border: 2px solid black;
`

// Not sure why this needs to be position relative
const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 175px;
  background-color: #eff0f0;
  cursor: pointer;
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

const TipBorder = styled.div`
  width: 0;
  height: 0;
  border-top: 25px solid black;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  position: absolute;
`

const TipFill = styled(TipBorder)`
  border-top: 25px solid white;
  position: relative;
  top: -2px;
`

// Generates the one line text description for a given list of project architects
const formatArchitects = (architects: string[]): string => {
  // Maximum number of characters that can fit on one line of popup
  // Depends on font size and character composition
  const MAX_LINE_LENGTH: number = 35

  // Truncate given string to given length, including trailing ellipsis
  const formatName = (name: string, length: number): string =>
    name.length <= length ? name : `${name.slice(0, length - 3)}...`

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
  const firstArchitect: string = formatName(architects[0], MAX_LINE_LENGTH - 10)
  return `${firstArchitect} + ${architects.length - 1} More`
}

interface MapPopupProps {
  project: Project
  markerRadius: number
}

const MapPopup = ({ project, markerRadius }: MapPopupProps): ReactElement => (
  <Marker
    latitude={project.position.latitude}
    longitude={project.position.longitude}
    offsetLeft={-(POPUP_WIDTH / 2)}
    offsetTop={-(POPUP_HEIGHT + 1.5 * markerRadius)}
  >
    <PopupContainer>
      <ContentContainer>
        <Link href={`/project/${encodeURIComponent(project.id.toString())}`}>
          <ImageContainer>
            <Image src={`/${project.id}.jpg`} layout="fill" objectFit="cover" />
          </ImageContainer>
        </Link>
        <TextContainer>
          <Name>{project.name}</Name>
          <Line>{formatArchitects(project.architects)}</Line>
          <Line>{project.year}</Line>
        </TextContainer>
      </ContentContainer>
      <TipContainer>
        <TipBorder />
        <TipFill />
      </TipContainer>
    </PopupContainer>
  </Marker>
)

export { MapPopup }
