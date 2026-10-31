import { jobs, profile } from '../content/data'
import ExternalLink from './ExternalLink'

export default function Resume() {
  return (
    <>
      <h2>{profile.name}</h2>
      <p>{profile.role}</p>
      <h3>Education</h3>
      <p>{profile.education}</p>
      <h3>Experience</h3>
      <ul>
        {jobs.map((j) => (
          <li key={j.id}>
            <strong>{j.role}</strong>, {j.org} ({j.period})
          </li>
        ))}
      </ul>
      <h3>Highlights</h3>
      <ul>
        {profile.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <h3>Links</h3>
      <p>
        <a href={`mailto:${profile.email}`}>{profile.email}</a> ·{' '}
        <ExternalLink href={profile.github}>GitHub</ExternalLink> ·{' '}
        <ExternalLink href={profile.linkedin}>LinkedIn</ExternalLink>
      </p>
    </>
  )
}
