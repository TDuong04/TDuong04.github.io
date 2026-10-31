import { parseHash, toHash } from './route'

test('parseHash reads a window id', () => {
  expect(parseHash('#/projects/vital-agent')).toBe('projects/vital-agent')
  expect(parseHash('#/resume')).toBe('resume')
})

test('parseHash returns null for empty hashes', () => {
  expect(parseHash('')).toBeNull()
  expect(parseHash('#')).toBeNull()
  expect(parseHash('#/')).toBeNull()
})

test('parseHash returns null for malformed percent-encoding instead of throwing', () => {
  expect(parseHash('#/%E0%A4%A')).toBeNull()
})

test('toHash round-trips and handles null', () => {
  expect(toHash(null)).toBe('#/')
  expect(toHash('resume')).toBe('#/resume')
  expect(parseHash(toHash('projects/pyman'))).toBe('projects/pyman')
})
