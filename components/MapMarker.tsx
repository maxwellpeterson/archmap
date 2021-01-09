import React, { ReactElement } from "react"
import { Marker } from "react-map-gl"
import styled from "styled-components"
import { Project } from "../types"

const MarkerIcon = styled.div<{ markerRadius: number }>`
  width: ${(props) => 2 * props.markerRadius}px;
  height: ${(props) => 2 * props.markerRadius}px;
  border-radius: ${(props) => props.markerRadius}px;
  background-color: #be1e2d;
  cursor: pointer;
`

interface MapMarkerProps {
  project: Project
  onClick: (project: Project) => void
  markerRadius: number
}

const MapMarker = ({
  project,
  onClick,
  markerRadius,
}: MapMarkerProps): ReactElement => {
  return (
    <Marker
      latitude={project.location.latitude}
      longitude={project.location.longitude}
      offsetTop={-markerRadius}
      offsetLeft={-markerRadius}
    >
      <MarkerIcon
        markerRadius={markerRadius}
        onClick={() => onClick(project)}
      />
    </Marker>
  )
}

export default MapMarker
