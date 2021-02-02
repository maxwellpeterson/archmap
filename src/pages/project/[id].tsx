import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import React, { ReactElement } from "react"
import { Project } from "../../types"
import { projects } from "../../data"
import styles from "./[id].module.css"

interface ProjectPageProps {
  project: Project
}

export default function ProjectPage({
  project,
}: ProjectPageProps): ReactElement {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.imageContainer}>
        <Image
          src={`/${project.id}.jpg`}
          layout="fill"
          objectFit="cover"
          className={styles.image}
        />
      </div>
      <h1>{project.name}</h1>
    </div>
  )
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
    project: projects.find(
      (project: Project) => params && project.id.toString() === params.id
    ),
  },
})
