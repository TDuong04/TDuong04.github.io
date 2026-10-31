import { useEffect, useRef } from 'react'
import { useWindowManager } from '../wm/WindowManager'
import type { IconProps } from './Icon'

export default function StartMenu({
  icons,
  onClose,
}: {
  icons: IconProps[]
  onClose: () => void
}) {
  const { dispatch } = useWindowManager()
  const ref = useRef<HTMLDivElement>(null)
  const items = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])

  useEffect(() => {
    items()[0]?.focus()
  }, [])

  const move = (delta: number | 'first' | 'last') => {
    const list = items()
    const at = list.indexOf(document.activeElement as HTMLElement)
    const next =
      delta === 'first' ? 0 : delta === 'last' ? list.length - 1 : (at + delta + list.length) % list.length
    list[next]?.focus()
  }

  return (
    <div
      ref={ref}
      className="start-menu"
      role="menu"
      aria-label="Start menu"
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); move(1) }
        else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1) }
        else if (e.key === 'Home') { e.preventDefault(); move('first') }
        else if (e.key === 'End') { e.preventDefault(); move('last') }
        else if (e.key === 'Escape') { e.stopPropagation(); onClose() }
      }}
    >
      {icons.map((i) => (
        <button
          key={i.id}
          type="button"
          role="menuitem"
          className="start-item"
          onClick={() => {
            dispatch({ type: 'open', id: i.id })
            onClose()
          }}
        >
          <span aria-hidden="true">{i.glyph}</span> {i.label}
        </button>
      ))}
    </div>
  )
}
