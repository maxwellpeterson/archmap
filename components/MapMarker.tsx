import React, { ReactElement } from "react"
import { Marker } from "react-map-gl"
import styled from "styled-components"
import { Project } from "../pages"

const MarkerIcon = styled.div<{ markerRadius: number }>`
  width: ${(props) => 2 * props.markerRadius}px;
  height: ${(props) => 2 * props.markerRadius}px;
  border-radius: ${(props) => props.markerRadius}px;
  background-color: red;
`

const MIN_MARKER_RADIUS = 3
const MAX_MARKER_RADIUS = 12

interface MapMarkerProps {
  project: Project
  onClick: (project: Project) => void
  zoomFactor: number
}

const MapMarker = ({
  project,
  onClick,
  zoomFactor,
}: MapMarkerProps): ReactElement => {
  // Apply poly scaling to zoomFactor in order to slow down marker growth
  // during middle stages of zoom (compare x, x^2, and x^3 over the interval [0, 1])
  const markerRadius =
    MIN_MARKER_RADIUS +
    (MAX_MARKER_RADIUS - MIN_MARKER_RADIUS) * zoomFactor ** 3
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
