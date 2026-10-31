import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import { initialWm, windowReducer, type WmAction, type WmState } from './windowReducer'
import { parseHash, toHash } from './route'

type Ctx = { state: WmState; dispatch: Dispatch<WmAction>; focusedId: string | null }

const WmContext = createContext<Ctx | null>(null)

export function useWindowManager(): Ctx {
  const ctx = useContext(WmContext)
  if (!ctx) throw new Error('useWindowManager must be used inside <WindowManager>')
  return ctx
}

export function WindowManager({
  isValidId,
  children,
}: {
  isValidId: (id: string) => boolean
  children: ReactNode
}) {
  const [state, dispatch] = useReducer(windowReducer, initialWm, (init) => {
    const id = parseHash(window.location.hash)
    return id && isValidId(id) ? windowReducer(init, { type: 'open', id }) : init
  })

  const focusedId = useMemo(() => {
    const visible = state.windows.filter((w) => !w.minimized)
    if (visible.length === 0) return null
    return visible.reduce((a, b) => (b.z > a.z ? b : a)).id
  }, [state.windows])

  // hash -> windows (user pastes or navigates to a link)
  useEffect(() => {
    const onHash = () => {
      const id = parseHash(window.location.hash)
      if (id && isValidId(id)) dispatch({ type: 'open', id })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [isValidId])

  // windows -> hash (replaceState: no hashchange event, no loop)
  useEffect(() => {
    const next = toHash(focusedId)
    if (window.location.hash !== next && !(next === '#/' && window.location.hash === '')) {
      window.history.replaceState(null, '', next)
    }
  }, [focusedId])

  const value = useMemo(() => ({ state, dispatch, focusedId }), [state, focusedId])
  return <WmContext.Provider value={value}>{children}</WmContext.Provider>
}
