import { profile } from '../content/data'
import { useWindowManager } from '../wm/WindowManager'

export default function Welcome() {
  const { dispatch } = useWindowManager()
  const open = (id: string) => dispatch({ type: 'open', id })
  return (
    <>
      <h2>{profile.name}</h2>
      <p>{profile.role}</p>
      <h3>Highlights</h3>
      <ul>
        {profile.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <p>
        <button type="button" className="btn" onClick={() => open('projects')}>Projects</button>
        <button type="button" className="btn" onClick={() => open('resume')}>Resume</button>
        <button type="button" className="btn" onClick={() => open('contact')}>Contact</button>
      </p>
    </>
  )
}
