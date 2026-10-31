import { profile } from '../content/data'
import ExternalLink from './ExternalLink'

export default function Contact() {
  return (
    <ul>
      <li><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
      <li><ExternalLink href={profile.github}>GitHub</ExternalLink></li>
      <li><ExternalLink href={profile.linkedin}>LinkedIn</ExternalLink></li>
    </ul>
  )
}
