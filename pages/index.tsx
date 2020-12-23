import React, { useState, useEffect, ReactElement } from "react"
import styled from "styled-components"
import ReactMapGL, { ViewportProps } from "react-map-gl"
import MapMarker from "../components/MapMarker"
import MapPopup from "../components/MapPopup"

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
    architects: ["Studio Olafur Eliasson"],
    year: 2015,
  },
  {
    id: 5022,
    location: {
      latitude: 55.668688,
      longitude: 12.577687,
    },
    name: "Copenhagen Harbour Bath",
    architects: ["Bjarke Ingels Group", "Julien de Smedt"],
    year: 2003,
  },
]

// Intial region currently near center of Copenhagen.
// Note that we are disallowing pitch change.
const INITIAL_VIEWPORT: ViewportProps = {
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
  maxPitch: 0,
  minPitch: 0,
}

// Maybe set background color in meta theme for faster initial load...
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #eff0f0;
`

interface HomeProps {
  mapboxToken: string
}

export default function Home({ mapboxToken }: HomeProps): ReactElement {
  // Keeps track of the current map viewport. Required for interactivity.
  const [viewport, setViewport] = useState<ViewportProps>(INITIAL_VIEWPORT)

  // For fetching data see:
  // https://visgl.github.io/react-map-gl/docs/api-reference/web-mercator-viewport#getboundsoptions

  // Keeps track of the project whose popup is currently visible, if there is one.
  const [activeProject, setActiveProject] = useState<Project>(null)

  // For resizing the map when the window in resized. Taken from stackoverflow.com/a/19014495
  // Also see gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
  useEffect(() => {
    const setViewportSize = (): void =>
      setViewport({
        ...viewport,
        width: window.innerWidth,
        height: window.innerHeight,
      })
    window.addEventListener("resize", setViewportSize)
    setViewportSize()
    return () => window.removeEventListener("resize", setViewportSize)
  }, [])

  // Handles clicks on the map. Clicking on the map closes the active popup if there is one. Note
  // that the popup will still remain active across pan actions (click and drag). Also note that
  // passing this to ReactMapGL as onNativeClick instead of onClick results in faster click response.
  const onMapClick = (): void => setActiveProject(null)

  // Handles clicks on map markers. If the marker for the active project is clicked a second time,
  // the popup will close. Otherwise, clicking on a marker opens a popup for that project.
  const onMarkerClick = (project: Project): void =>
    setActiveProject(
      activeProject && activeProject.id === project.id ? null : project
    )

  return (
    <Container>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={mapboxToken}
        onViewportChange={setViewport}
        onNativeClick={onMapClick}
      >
        {projects.map(
          (project: Project): ReactElement => (
            <MapMarker
              key={project.id}
              project={project}
              onClick={onMarkerClick}
            />
          )
        )}
        {activeProject && <MapPopup project={activeProject} />}
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
