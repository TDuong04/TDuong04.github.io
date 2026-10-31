import { useEffect, useState } from 'react'
import { useWindowManager } from '../wm/WindowManager'
import StartMenu from './StartMenu'
import type { IconProps } from './Icon'

const hhmm = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function Taskbar({
  icons,
  titleOf,
}: {
  icons: IconProps[]
  titleOf: (id: string) => string
}) {
  const { state, dispatch, focusedId } = useWindowManager()
  const [menuOpen, setMenuOpen] = useState(false)
  const [time, setTime] = useState(hhmm)

  useEffect(() => {
    const t = setInterval(() => setTime(hhmm()), 30_000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      {menuOpen && <StartMenu icons={icons} onClose={() => setMenuOpen(false)} />}
      <div className="taskbar" role="toolbar" aria-label="Taskbar">
        <button
          type="button"
          className="start-btn"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          Start
        </button>
        <div className="task-buttons">
          {state.windows.map((w) => (
            <button
              key={w.id}
              type="button"
              className={`task-btn${focusedId === w.id ? ' is-active' : ''}`}
              onClick={() =>
                dispatch({ type: focusedId === w.id ? 'toggleMinimize' : 'focus', id: w.id })
              }
            >
              {titleOf(w.id)}
            </button>
          ))}
        </div>
        <span className="clock" aria-label="Clock">
          {time}
        </span>
      </div>
    </>
  )
}
