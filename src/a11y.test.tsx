import { readFileSync } from 'node:fs'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { icons } from './apps/registry'
import html from '../index.html?raw'
const css = readFileSync('src/styles/win95.css', 'utf8')

beforeEach(() => {
  window.location.hash = ''
  sessionStorage.setItem('win95-booted', '1')
})

test('index.html has title, description and Open Graph tags', () => {
  expect(html).toMatch(/<title>[^<]*Huynh Thai Duong[^<]*<\/title>/)
  expect(html).toMatch(/<meta\s+name="description"\s+content="[^"]{20,}"/)
  expect(html).toMatch(/<meta\s+property="og:title"/)
  expect(html).toMatch(/<meta\s+property="og:description"/)
  expect(html).toMatch(/<meta\s+property="og:type"/)
  expect(html).toMatch(/<link\s+rel="icon"/)
})

test('index.html contains no phone number', () => {
  expect(html).not.toMatch(/\+?\d[\d\s().-]{8,}\d/)
})

test('every desktop icon is a focusable button that opens on Enter', async () => {
  const user = userEvent.setup()
  const { container } = render(<App />)
  const grid = within(container.querySelector('.icon-grid') as HTMLElement)
  for (const i of icons.filter((x) => x.id !== 'welcome')) {
    const btn = grid.getByRole('button', { name: new RegExp(i.label, 'i') })
    expect(btn).not.toHaveAttribute('tabindex', '-1')
    btn.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog', { name: new RegExp(i.label === 'Resume' ? 'Resume.txt' : i.label, 'i') })).toBeInTheDocument()
  }
})

test('stylesheet has focus-visible styles and a reduced-motion rule', () => {
  expect(css).toMatch(/:focus-visible/)
  expect(css).toMatch(/prefers-reduced-motion:\s*reduce/)
  expect(css).toMatch(/max-width:\s*700px/)
})
