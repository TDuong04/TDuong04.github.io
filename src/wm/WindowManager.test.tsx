import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { WindowManager, useWindowManager } from './WindowManager'

const valid = (id: string) => ['resume', 'projects', 'projects/pyman'].includes(id)
const wrapper = ({ children }: { children: ReactNode }) => (
  <WindowManager isValidId={valid}>{children}</WindowManager>
)

beforeEach(() => {
  window.location.hash = ''
})

test('a valid hash opens that window on load', () => {
  window.location.hash = '#/projects/pyman'
  const { result } = renderHook(() => useWindowManager(), { wrapper })
  expect(result.current.state.windows.map((w) => w.id)).toEqual(['projects/pyman'])
  expect(result.current.focusedId).toBe('projects/pyman')
})

test('an unknown or malformed hash opens nothing and does not throw', () => {
  for (const h of ['#/projects/nope', '#/%E0%A4%A']) {
    window.location.hash = h
    const { result } = renderHook(() => useWindowManager(), { wrapper })
    expect(result.current.state.windows).toHaveLength(0)
  }
})

test('focusing a window writes it to the hash', () => {
  const { result } = renderHook(() => useWindowManager(), { wrapper })
  act(() => result.current.dispatch({ type: 'open', id: 'resume' }))
  expect(window.location.hash).toBe('#/resume')
})
