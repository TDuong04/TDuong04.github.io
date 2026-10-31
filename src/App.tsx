import { useEffect } from 'react'
import { icons, isValidId, resolve } from './apps/registry'
import Desktop from './ui/Desktop'
import { useWindowManager, WindowManager } from './wm/WindowManager'

const isPhone = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 700px)').matches

/** On desktop widths, open Welcome unless a deep link already opened something. */
function AutoWelcome() {
  const { state, dispatch } = useWindowManager()
  useEffect(() => {
    if (!isPhone() && state.windows.length === 0) dispatch({ type: 'open', id: 'welcome' })
    // run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

export default function App() {
  return (
    <WindowManager isValidId={isValidId}>
      <Desktop icons={icons} resolve={resolve} />
      <AutoWelcome />
    </WindowManager>
  )
}
