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
