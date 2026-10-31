import { projects } from '../content/data'
import { useWindowManager } from '../wm/WindowManager'

export default function Projects() {
  const { dispatch } = useWindowManager()
  return (
    <ul className="file-list">
      {projects.map((p) => (
        <li key={p.id}>
          <button
            type="button"
            className="file-item"
            onClick={() => dispatch({ type: 'open', id: `projects/${p.id}` })}
          >
            <span aria-hidden="true">📁 </span>
            {p.title}
          </button>
        </li>
      ))}
    </ul>
  )
}
