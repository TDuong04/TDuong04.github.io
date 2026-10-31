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
  return (
    <div className="start-menu" role="menu" aria-label="Start menu">
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
