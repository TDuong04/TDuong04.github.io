export type WinState = { id: string; x: number; y: number; z: number; minimized: boolean }
export type WmState = { windows: WinState[]; topZ: number }
export type Viewport = { w: number; h: number }

export type WmAction =
  | { type: 'open'; id: string }
  | { type: 'close'; id: string }
  | { type: 'focus'; id: string }
  | { type: 'move'; id: string; x: number; y: number; viewport: Viewport }
  | { type: 'toggleMinimize'; id: string }

export const TASKBAR_HEIGHT = 28
export const MIN_VISIBLE = 40

export const initialWm: WmState = { windows: [], topZ: 0 }

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi)

function raise(state: WmState, id: string): WmState {
  const topZ = state.topZ + 1
  return {
    topZ,
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, z: topZ, minimized: false } : w,
    ),
  }
}

export function windowReducer(state: WmState, action: WmAction): WmState {
  switch (action.type) {
    case 'open': {
      if (state.windows.some((w) => w.id === action.id)) return raise(state, action.id)
      const topZ = state.topZ + 1
      const n = state.windows.length
      const win: WinState = {
        id: action.id,
        x: 80 + (n % 8) * 28,
        y: 24 + (n % 8) * 28,
        z: topZ,
        minimized: false,
      }
      return { topZ, windows: [...state.windows, win] }
    }
    case 'close':
      if (!state.windows.some((w) => w.id === action.id)) return state
      return { ...state, windows: state.windows.filter((w) => w.id !== action.id) }
    case 'focus':
      if (!state.windows.some((w) => w.id === action.id)) return state
      return raise(state, action.id)
    case 'move': {
      const { w, h } = action.viewport
      const x = clamp(action.x, 0, Math.max(0, w - MIN_VISIBLE))
      const y = clamp(action.y, 0, Math.max(0, h - TASKBAR_HEIGHT - MIN_VISIBLE))
      return {
        ...state,
        windows: state.windows.map((win) => (win.id === action.id ? { ...win, x, y } : win)),
      }
    }
    case 'toggleMinimize':
      return {
        ...state,
        windows: state.windows.map((win) =>
          win.id === action.id ? { ...win, minimized: !win.minimized } : win,
        ),
      }
  }
}
