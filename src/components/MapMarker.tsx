import React, { ReactElement } from "react"
import { Marker } from "react-map-gl"
import styled from "styled-components"
import { Position } from "../types"

const MarkerIcon = styled.div<{ radius: number }>`
  width: ${(props) => 2 * props.radius}px;
  height: ${(props) => 2 * props.radius}px;
  border-radius: ${(props) => props.radius}px;
  background-color: #be1e2d;
  cursor: pointer;
`

interface MapMarkerProps {
  position: Position
  radius: number
  onClick: () => void
}

const MapMarker = ({
  position,
  radius,
  onClick,
}: MapMarkerProps): ReactElement => {
  return (
    <Marker
      latitude={position.latitude}
      longitude={position.longitude}
      offsetTop={-radius}
      offsetLeft={-radius}
    >
      <MarkerIcon radius={radius} onClick={onClick} />
    </Marker>
  )
}

export default MapMarker
