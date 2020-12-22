import React, { useState, useEffect } from "react"
import styled from "styled-components"
import ReactMapGL, { ViewportProps } from "react-map-gl"
import MapMarker from "../components/map-marker"
import MapPopup from "../components/map-popup"

export interface Project {
  id: number
  location: {
    latitude: number
    longitude: number
  }
  name: string
  architects: string[]
  year: number
}

const projects: Project[] = [
  {
    id: 20745,
    location: {
      latitude: 55.672062,
      longitude: 12.578563,
    },
    name: "BLOX",
    architects: ["OMA / Ellen van Loon"],
    year: 2018,
  },
  {
    id: 10155,
    location: {
      latitude: 55.673317,
      longitude: 12.582735,
    },
    name: "The Royal Library",
    architects: ["Schmidt Hammer Lassen"],
    year: 1999,
  },
  {
    id: 37094,
    location: {
      latitude: 55.672438,
      longitude: 12.583813,
    },
    name: "Cirkelbroen Bridge",
    architects: ["Studio Olafur Eliasson", "1 More"],
    year: 2015,
  },
  {
    id: 5022,
    location: {
      latitude: 55.668688,
      longitude: 12.577687,
    },
    name: "Copenhagen Harbour Bath",
    architects: ["Bjarke Ingels Group", "Julien de Smedt", "Julien de Smedt"],
    year: 2003,
  },
]

// Maybe try to match background color to color of loading map tiles
// to visually smooth initial load
const Container = styled.div`
  width: 100vw;
  height: 100vh;
`

interface HomeProps {
  mapboxToken: string
}

export default function Home({ mapboxToken }: HomeProps) {
  // Maybe put default values somewhere else...
  const [viewport, setViewport] = useState<ViewportProps>({
    latitude: 55.672125,
    longitude: 12.580146,
    width: 0,
    height: 0,
    zoom: 15,
    bearing: 0,
    pitch: 0,
    altitude: 0,
    maxZoom: 20,
    minZoom: 0,
    maxPitch: 20,
    minPitch: 0,
  })

  const [selectedProject, setSelectedProject] = useState<Project>(null)

  // Taken from stackoverflow.com/a/19014495
  // Also see gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
  // There might be a better way to handle initial load, not sure if currently an issue
  useEffect(() => {
    function updateViewportSize() {
      setViewport({
        ...viewport,
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener("resize", updateViewportSize)
    updateViewportSize()
    return () => window.removeEventListener("resize", updateViewportSize)
  }, [])

  return (
    <Container>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={mapboxToken}
        onViewportChange={setViewport}
      >
        {projects.map((project) => (
          <MapMarker
            key={project.id}
            project={project}
            onClick={(event) => {
              event.preventDefault()
              setSelectedProject(project)
            }}
          />
        ))}
        {selectedProject && <MapPopup project={selectedProject} />}
      </ReactMapGL>
    </Container>
  )
}

// Not sure this is the best way to handle the mapbox key...
export async function getStaticProps(): Promise<{ props: HomeProps }> {
  return {
    props: { mapboxToken: process.env.MAPBOX_TOKEN },
  }
}
