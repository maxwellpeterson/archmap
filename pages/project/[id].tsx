import React, { ReactElement } from "react"
import { Project } from "../../types"
import { projects } from "../../data"

interface ProjectPageProps {
  project: Project
}

export default function ProjectPage({
  project,
}: ProjectPageProps): ReactElement {
  return <h1>{project.name}</h1>
}

interface PathProps {
  params: {
    id: string
  }
}

export async function getStaticPaths(): Promise<{
  paths: PathProps[]
  fallback: boolean
}> {
  return {
    paths: projects.map((project: Project) => ({
      params: {
        id: project.id.toString(),
      },
    })),
    fallback: true,
  }
}

export async function getStaticProps({
  params,
}: PathProps): Promise<{ props: ProjectPageProps }> {
  return {
    props: {
      project: projects.filter(
        (project: Project) => project.id.toString() === params.id
      )[0],
    },
  }
}
