import { profile, projects, jobs, skillGroups } from './data'

const all = () => JSON.stringify({ profile, projects, jobs, skillGroups })

test('project ids are unique and in spec order', () => {
  expect(projects.map((p) => p.id)).toEqual([
    'vital-agent', 'plantos', 'can-safety', 'fish-detection', 'scootr',
    'devision', 'rentmate', 'travista', 'guess-your-paddy', 'clock-watch', 'pyman',
  ])
})

test('every link url starts with https://', () => {
  const urls = [
    ...projects.flatMap((p) => p.links.map((l) => l.url)),
    profile.github,
    profile.linkedin,
  ]
  expect(urls.length).toBeGreaterThan(10)
  urls.forEach((u) => expect(u).toMatch(/^https:\/\//))
})

test('no phone number anywhere', () => {
  expect(all()).not.toMatch(/\+?\d[\d\s().-]{8,}\d/)
  expect(all()).not.toMatch(/tel:/i)
})

test('forbidden topics absent', () => {
  expect(all()).not.toMatch(/\b(tuturuuu|nova|spark|iceberg|lakehouse|clickhouse|superset|dataflow)\b/i)
})

test('profile email and highlights', () => {
  expect(profile.email).toBe('thaiduong.works@gmail.com')
  expect(profile.highlights).toHaveLength(4)
})

test('jobs list starts with Bosch Vietnam and has four entries', () => {
  expect(jobs[0].org).toBe('Bosch Vietnam')
  expect(jobs).toHaveLength(4)
})

test('there are four skill groups', () => {
  expect(skillGroups).toHaveLength(4)
})
