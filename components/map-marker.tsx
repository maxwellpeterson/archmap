import React from "react"
import { Marker, MarkerProps } from "react-map-gl"
import styled from "styled-components"
import { Project } from "../pages/index"

const MarkerIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: red;
`

interface MapMarkerProps {
  project: Project
}

export default function MapMarker({ project }: MapMarkerProps) {
  return (
    <Marker
      latitude={project.location.latitude}
      longitude={project.location.longitude}
    >
      <MarkerIcon />
    </Marker>
  )
}
