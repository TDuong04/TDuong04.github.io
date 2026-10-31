import { useEffect, useState } from 'react'
import { icons, isValidId, resolve } from './apps/registry'
import BootScreen, { shouldBoot } from './ui/BootScreen'
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
  const [booting, setBooting] = useState(shouldBoot)

  // Desktop mounts only after boot so deep links and Welcome apply to a visible desktop.
  if (booting) return <BootScreen onDone={() => setBooting(false)} />

  return (
    <WindowManager isValidId={isValidId}>
      <Desktop icons={icons} resolve={resolve} />
      <AutoWelcome />
    </WindowManager>
  )
}
