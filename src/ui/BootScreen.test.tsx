import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import App from '../App'
import BootScreen, { markBooted, shouldBoot } from './BootScreen'

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  sessionStorage.clear()
  window.location.hash = ''
})

test('calls onDone after about 3 seconds, not before', () => {
  vi.useFakeTimers()
  const onDone = vi.fn()
  render(<BootScreen onDone={onDone} />)
  act(() => { vi.advanceTimersByTime(2500) })
  expect(onDone).not.toHaveBeenCalled()
  act(() => { vi.advanceTimersByTime(800) })
  expect(onDone).toHaveBeenCalledTimes(1)
})

test('click skips immediately, and only once', async () => {
  const onDone = vi.fn()
  const user = userEvent.setup()
  render(<BootScreen onDone={onDone} />)
  await user.click(screen.getByRole('status'))
  await user.click(screen.getByRole('status'))
  expect(onDone).toHaveBeenCalledTimes(1)
})

test('any keydown skips', async () => {
  const onDone = vi.fn()
  const user = userEvent.setup()
  render(<BootScreen onDone={onDone} />)
  await user.keyboard('a')
  expect(onDone).toHaveBeenCalledTimes(1)
})

test('shouldBoot is true first, false after markBooted', () => {
  expect(shouldBoot()).toBe(true)
  markBooted()
  expect(shouldBoot()).toBe(false)
})

test('shouldBoot is false under reduced motion', () => {
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q }))
  expect(shouldBoot()).toBe(false)
})

test('shouldBoot and markBooted do not throw when sessionStorage throws', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied') })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('denied') })
  expect(() => shouldBoot()).not.toThrow()
  expect(shouldBoot()).toBe(true)
  expect(() => markBooted()).not.toThrow()
})

test('App shows the boot screen first, then the desktop after a skip', async () => {
  const user = userEvent.setup()
  render(<App />)
  expect(screen.getByRole('status')).toBeInTheDocument()
  await user.click(screen.getByRole('status'))
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
  expect(screen.getByRole('dialog', { name: 'Welcome.exe' })).toBeInTheDocument()
})

test('App skips boot when already booted this session', () => {
  markBooted()
  render(<App />)
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})
