import { useWindowManager } from '../wm/WindowManager'

const isCoarse = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches

export type IconProps = { id: string; label: string; glyph: string }

export default function Icon({ id, label, glyph }: IconProps) {
  const { dispatch } = useWindowManager()
  const open = () => dispatch({ type: 'open', id })
  return (
    <button
      type="button"
      className="icon"
      onDoubleClick={open}
      onClick={() => {
        if (isCoarse()) open()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          open()
        }
      }}
    >
      <span className="icon-glyph" aria-hidden="true">
        {glyph}
      </span>
      <span className="icon-label">{label}</span>
    </button>
  )
}
