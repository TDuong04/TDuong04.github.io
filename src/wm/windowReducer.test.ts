import { windowReducer, initialWm, type WmState } from './windowReducer'

const vp = { w: 1000, h: 800 }
const open = (s: WmState, id: string) => windowReducer(s, { type: 'open', id })

test('open adds a window at highest z', () => {
  const s = open(open(initialWm, 'a'), 'b')
  expect(s.windows.map((w) => w.id)).toEqual(['a', 'b'])
  expect(s.windows[1].z).toBeGreaterThan(s.windows[0].z)
})

test('open on an existing id focuses instead of duplicating', () => {
  const s = open(open(open(initialWm, 'a'), 'b'), 'a')
  expect(s.windows).toHaveLength(2)
  const a = s.windows.find((w) => w.id === 'a')!
  const b = s.windows.find((w) => w.id === 'b')!
  expect(a.z).toBeGreaterThan(b.z)
})

test('close removes and leaves others', () => {
  const s = windowReducer(open(open(initialWm, 'a'), 'b'), { type: 'close', id: 'a' })
  expect(s.windows.map((w) => w.id)).toEqual(['b'])
})

test('close of an unknown id is a no-op', () => {
  const s = open(initialWm, 'a')
  expect(windowReducer(s, { type: 'close', id: 'zzz' })).toEqual(s)
})

test('focus raises z above all', () => {
  const s0 = open(open(initialWm, 'a'), 'b')
  const s = windowReducer(s0, { type: 'focus', id: 'a' })
  const z = (id: string) => s.windows.find((w) => w.id === id)!.z
  expect(z('a')).toBeGreaterThan(z('b'))
})

test('move clamps so the title bar stays on screen', () => {
  const s0 = open(initialWm, 'a')
  const lo = windowReducer(s0, { type: 'move', id: 'a', x: -500, y: -500, viewport: vp })
  expect([lo.windows[0].x, lo.windows[0].y]).toEqual([0, 0])
  const hi = windowReducer(s0, { type: 'move', id: 'a', x: 5000, y: 5000, viewport: vp })
  expect([hi.windows[0].x, hi.windows[0].y]).toEqual([960, 732])
})

test('toggleMinimize flips minimized', () => {
  const s0 = open(initialWm, 'a')
  const s1 = windowReducer(s0, { type: 'toggleMinimize', id: 'a' })
  expect(s1.windows[0].minimized).toBe(true)
  expect(windowReducer(s1, { type: 'toggleMinimize', id: 'a' }).windows[0].minimized).toBe(false)
})

test('focus restores a minimized window', () => {
  const s = windowReducer(
    windowReducer(open(initialWm, 'a'), { type: 'toggleMinimize', id: 'a' }),
    { type: 'focus', id: 'a' },
  )
  expect(s.windows[0].minimized).toBe(false)
})
