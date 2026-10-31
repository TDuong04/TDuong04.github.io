import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import App from '../App'
import { WindowManager } from '../wm/WindowManager'
import { icons, resolve, isValidId } from './registry'
import { projects, profile } from '../content/data'

const Wrap = ({ children }: { children: ReactNode }) => (
  <WindowManager isValidId={isValidId}>{children}</WindowManager>
)

function body(id: string) {
  const app = resolve(id)!
  const { container } = render(<Wrap><app.Component /></Wrap>)
  return container
}

beforeEach(() => {
  window.location.hash = ''
  sessionStorage.setItem('win95-booted', '1')
})

test('registry exposes the six top-level icons', () => {
  expect(icons.map((i) => i.id)).toEqual([
    'welcome', 'projects', 'experience', 'skills', 'resume', 'contact',
  ])
  expect(resolve('nope')).toBeNull()
  expect(isValidId('projects/vital-agent')).toBe(true)
  expect(isValidId('projects/nope')).toBe(false)
})

test('projects window lists 11 projects in order', () => {
  body('projects')
  const items = screen.getAllByRole('button').map((b) => b.textContent ?? '')
  expect(items).toHaveLength(11)
  projects.forEach((p, i) => expect(items[i]).toContain(p.title))
})

test('clicking a project opens its detail window with links', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.dblClick(screen.getByRole('button', { name: /my projects/i }))
  const list = screen.getByRole('dialog', { name: /my projects/i })
  await user.click(within(list).getByRole('button', { name: /vital agent/i }))
  const detail = screen.getByRole('dialog', { name: 'Vital Agent' })
  expect(within(detail).getByRole('link', { name: /github/i })).toHaveAttribute(
    'href',
    'https://github.com/Oucru-Innovations/vital-agent',
  )
})

test('all external links have target _blank and rel noopener noreferrer', () => {
  const ids = ['welcome', 'projects', 'experience', 'skills', 'resume', 'contact',
    ...projects.map((p) => `projects/${p.id}`)]
  let checked = 0
  for (const id of ids) {
    const c = body(id)
    c.querySelectorAll('a[href^="http"]').forEach((a) => {
      checked++
      expect(a).toHaveAttribute('target', '_blank')
      expect(a.getAttribute('rel')).toMatch(/noopener/)
      expect(a.getAttribute('rel')).toMatch(/noreferrer/)
    })
    document.body.innerHTML = ''
  }
  expect(checked).toBeGreaterThan(10)
})

test('resume has no tel link and no pdf link', () => {
  const c = body('resume')
  expect(c.querySelector('a[href^="tel:"]')).toBeNull()
  expect(c.querySelector('a[href$=".pdf"]')).toBeNull()
  expect(c.textContent).toContain('Bosch Vietnam')
  expect(c.textContent).toContain('3.64')
})

test('contact shows exactly email, github, linkedin', () => {
  const c = body('contact')
  const hrefs = [...c.querySelectorAll('a')].map((a) => a.getAttribute('href'))
  expect(hrefs).toEqual([`mailto:${profile.email}`, profile.github, profile.linkedin])
})

test('welcome shows 4 highlights', () => {
  const c = body('welcome')
  expect(c.querySelectorAll('li')).toHaveLength(4)
})

test('deep link #/projects/vital-agent opens that detail on load', () => {
  window.location.hash = '#/projects/vital-agent'
  render(<App />)
  expect(screen.getByRole('dialog', { name: 'Vital Agent' })).toBeInTheDocument()
})

test('unknown deep link opens no such window, does not throw, welcome opens', () => {
  window.location.hash = '#/projects/nope'
  render(<App />)
  expect(screen.queryByRole('dialog', { name: /nope/i })).not.toBeInTheDocument()
  expect(screen.getByRole('dialog', { name: 'Welcome.exe' })).toBeInTheDocument()
})

test('welcome auto-opens on desktop width', () => {
  render(<App />)
  expect(screen.getByRole('dialog', { name: 'Welcome.exe' })).toBeInTheDocument()
})
