import { useEffect, useRef, type ReactNode } from 'react'
import { useWindowManager } from '../wm/WindowManager'

const isMobile = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 700px)').matches

export default function Window({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  const { state, dispatch, focusedId } = useWindowManager()
  const win = state.windows.find((w) => w.id === id)
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef<{ dx: number; dy: number } | null>(null)
  const focused = focusedId === id

  useEffect(() => {
    if (focused) ref.current?.focus()
  }, [focused])

  if (!win) return null

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={title}
      tabIndex={-1}
      className={`window${focused ? ' is-focused' : ''}`}
      hidden={win.minimized}
      style={{ left: win.x, top: win.y, zIndex: win.z }}
      onPointerDown={() => dispatch({ type: 'focus', id })}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          dispatch({ type: 'close', id })
        }
      }}
    >
      <div
        className="title-bar"
        onPointerDown={(e) => {
          if (isMobile() || (e.target as HTMLElement).closest('button')) return
          drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y }
          e.currentTarget.setPointerCapture?.(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (!drag.current) return
          dispatch({
            type: 'move',
            id,
            x: e.clientX - drag.current.dx,
            y: e.clientY - drag.current.dy,
            viewport: { w: window.innerWidth, h: window.innerHeight },
          })
        }}
        onPointerUp={() => {
          drag.current = null
        }}
      >
        <span className="title-text">{title}</span>
        <span className="title-buttons">
          <button
            type="button"
            className="title-btn"
            aria-label="Minimize"
            onClick={() => dispatch({ type: 'toggleMinimize', id })}
          >
            _
          </button>
          <button
            type="button"
            className="title-btn"
            aria-label="Close"
            onClick={() => dispatch({ type: 'close', id })}
          >
            ×
          </button>
        </span>
      </div>
      <div className="window-body">{children}</div>
    </div>
  )
}
