import type { Project } from '../content/types'
import ExternalLink from './ExternalLink'

export default function ProjectDetail({ project }: { project: Project }) {
  return (
    <>
      <h2>{project.title}</h2>
      {project.period && <p>{project.period}</p>}
      <p>{project.summary}</p>
      <ul className="tag-list">
        {project.tags.map((t) => (
          <li key={t} className="tag">{t}</li>
        ))}
      </ul>
      <p>
        {project.links.map((l) => (
          <span key={l.url} className="btn-wrap">
            <ExternalLink href={l.url}>{l.label}</ExternalLink>{' '}
          </span>
        ))}
      </p>
    </>
  )
}
