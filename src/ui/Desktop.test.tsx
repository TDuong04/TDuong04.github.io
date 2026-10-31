import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Desktop, { type IconDef, type Resolve } from './Desktop'
import { WindowManager } from '../wm/WindowManager'

const icons: IconDef[] = [
  { id: 'alpha', label: 'Alpha', glyph: 'A' },
  { id: 'beta', label: 'Beta', glyph: 'B' },
]
const resolve: Resolve = (id) =>
  id === 'alpha' || id === 'beta'
    ? { title: id === 'alpha' ? 'Alpha Window' : 'Beta Window', Component: () => <p>{id} body</p> }
    : null

function setup() {
  window.location.hash = ''
  const user = userEvent.setup()
  render(
    <WindowManager isValidId={(id) => resolve(id) !== null}>
      <Desktop icons={icons} resolve={resolve} />
    </WindowManager>,
  )
  return user
}

test('double-clicking an icon opens its window', async () => {
  const user = setup()
  await user.dblClick(screen.getByRole('button', { name: /alpha/i }))
  expect(screen.getByRole('dialog', { name: 'Alpha Window' })).toBeInTheDocument()
})

test('opening the same icon twice leaves one window', async () => {
  const user = setup()
  const icon = screen.getByRole('button', { name: /alpha/i })
  await user.dblClick(icon)
  await user.dblClick(icon)
  expect(screen.getAllByRole('dialog')).toHaveLength(1)
})

test('Enter on a focused icon opens it', async () => {
  const user = setup()
  screen.getByRole('button', { name: /beta/i }).focus()
  await user.keyboard('{Enter}')
  expect(screen.getByRole('dialog', { name: 'Beta Window' })).toBeInTheDocument()
})

test('Escape closes the focused window', async () => {
  const user = setup()
  await user.dblClick(screen.getByRole('button', { name: /alpha/i }))
  await user.keyboard('{Escape}')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('close button closes the window', async () => {
  const user = setup()
  await user.dblClick(screen.getByRole('button', { name: /alpha/i }))
  await user.click(screen.getByRole('button', { name: /close/i }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('taskbar shows a button per open window', async () => {
  const user = setup()
  await user.dblClick(screen.getByRole('button', { name: /alpha/i }))
  await user.dblClick(screen.getByRole('button', { name: /beta/i }))
  const bar = screen.getByRole('toolbar', { name: /taskbar/i })
  expect(within(bar).getByRole('button', { name: 'Alpha Window' })).toBeInTheDocument()
  expect(within(bar).getByRole('button', { name: 'Beta Window' })).toBeInTheDocument()
})

test('Start menu lists every icon label and opens one', async () => {
  const user = setup()
  await user.click(screen.getByRole('button', { name: /start/i }))
  const menu = screen.getByRole('menu')
  expect(within(menu).getByRole('menuitem', { name: /alpha/i })).toBeInTheDocument()
  expect(within(menu).getByRole('menuitem', { name: /beta/i })).toBeInTheDocument()
  await user.click(within(menu).getByRole('menuitem', { name: /beta/i }))
  expect(screen.getByRole('dialog', { name: 'Beta Window' })).toBeInTheDocument()
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})

// ---- final-review fixes ----
import { fireEvent } from '@testing-library/react'
import { readFileSync } from 'node:fs'

test('window max-height depends on its position so the bottom never hides under the taskbar', async () => {
  const user = setup()
  await user.dblClick(screen.getByRole('button', { name: /alpha/i }))
  await user.dblClick(screen.getByRole('button', { name: /beta/i }))
  for (const name of ['Alpha Window', 'Beta Window']) {
    const el = screen.getByRole('dialog', { name })
    const top = parseInt(el.style.top, 10)
    const max = parseInt(el.style.maxHeight, 10)
    expect(top + max).toBeLessThanOrEqual(window.innerHeight - 28)
    expect(max).toBeGreaterThan(0)
  }
})

test('Start menu moves focus to its first item when opened', async () => {
  const user = setup()
  await user.click(screen.getByRole('button', { name: /start/i }))
  expect(screen.getByRole('menuitem', { name: /alpha/i })).toHaveFocus()
})

test('ArrowDown / ArrowUp move between Start menu items', async () => {
  const user = setup()
  await user.click(screen.getByRole('button', { name: /start/i }))
  await user.keyboard('{ArrowDown}')
  expect(screen.getByRole('menuitem', { name: /beta/i })).toHaveFocus()
  await user.keyboard('{ArrowUp}')
  expect(screen.getByRole('menuitem', { name: /alpha/i })).toHaveFocus()
})

test('Escape closes the Start menu and returns focus to Start', async () => {
  const user = setup()
  await user.click(screen.getByRole('button', { name: /start/i }))
  await user.keyboard('{Escape}')
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: /start/i })).toHaveFocus()
})

test('clicking outside the Start menu closes it', async () => {
  const user = setup()
  await user.click(screen.getByRole('button', { name: /start/i }))
  fireEvent.pointerDown(document.body)
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})

test('phone window height uses dvh so iOS toolbars do not hide the bottom', () => {
  const css = readFileSync('src/styles/win95.css', 'utf8')
  expect(css).toMatch(/100dvh/)
})
