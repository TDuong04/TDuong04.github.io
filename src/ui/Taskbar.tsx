import { useEffect, useRef, useState } from 'react'
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
  const startRef = useRef<HTMLButtonElement>(null)

  const closeMenu = (returnFocus: boolean) => {
    setMenuOpen(false)
    if (returnFocus) startRef.current?.focus()
  }

  // close on any pointer press outside the menu and the Start button
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.closest('.start-menu, .start-btn')) return
      setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [menuOpen])

  useEffect(() => {
    const t = setInterval(() => setTime(hhmm()), 30_000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      {menuOpen && <StartMenu icons={icons} onClose={() => closeMenu(true)} />}
      <div className="taskbar" role="toolbar" aria-label="Taskbar">
        <button
          type="button"
          ref={startRef}
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
