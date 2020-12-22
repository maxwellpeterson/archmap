import React, { MouseEventHandler } from "react"
import { Marker } from "react-map-gl"
import styled from "styled-components"
import { Project } from "../pages"

const MARKER_RADIUS = 12

const MarkerIcon = styled.div`
  width: ${2 * MARKER_RADIUS}px;
  height: ${2 * MARKER_RADIUS}px;
  border-radius: ${MARKER_RADIUS}px;
  background-color: red;
`

interface MapMarkerProps {
  project: Project
  onClick: MouseEventHandler<HTMLDivElement>
}

const MapMarker = ({ project, onClick }: MapMarkerProps) => (
  <Marker
    latitude={project.location.latitude}
    longitude={project.location.longitude}
    offsetTop={-MARKER_RADIUS}
    offsetLeft={-MARKER_RADIUS}
  >
    <MarkerIcon onClick={onClick} />
  </Marker>
)

export default MapMarker
