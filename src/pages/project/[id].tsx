import { GetStaticPaths, GetStaticProps } from "next"
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

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: projects.map((project: Project) => ({
    params: {
      id: project.id.toString(),
    },
  })),
  fallback: "blocking",
})

// Need to figure out how to handle 404 redirect for projects that don't exist...
export const getStaticProps: GetStaticProps = async ({ params }) => ({
  props: {
    project: projects.filter(
      (project: Project) => params && project.id.toString() === params.id
    )[0],
  },
})
