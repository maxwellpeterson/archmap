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
