export interface Position {
  latitude: number
  longitude: number
}

export interface Project {
  id: number
  position: Position
  name: string
  architects: string[]
  year: number
}
