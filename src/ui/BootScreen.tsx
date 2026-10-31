import { useEffect, useRef, useState } from 'react'

export const BOOT_KEY = 'win95-booted'
const BOOT_MS = 3000

const LINES = [
  'Award Modular BIOS v4.51PG, An Energy Star Ally',
  'Copyright (C) 1984-95, Award Software, Inc.',
  '',
  'CPU: Thai Duong 4.0 GPA',
  'Memory Test: 640K OK',
  'Detecting Primary Master ... Portfolio HDD',
  'Detecting Embedded Devices ... Raspberry Pi, Jetson, CAN',
  '',
  'Starting Windows 95...',
]

export function shouldBoot(): boolean {
  try {
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return false
    }
    return sessionStorage.getItem(BOOT_KEY) !== '1'
  } catch {
    return true
  }
}

export function markBooted(): void {
  try {
    sessionStorage.setItem(BOOT_KEY, '1')
  } catch {
    // storage unavailable (private mode): boot may repeat, never crash
  }
}

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const done = useRef(false)
  const [shown, setShown] = useState(1)

  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  const finish = useRef(() => {
    if (done.current) return
    done.current = true
    markBooted()
    onDoneRef.current()
  })

  useEffect(() => {
    const end = setTimeout(() => finish.current(), BOOT_MS)
    const step = setInterval(() => setShown((n) => Math.min(n + 1, LINES.length)), 300)
    const onKey = () => finish.current()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(end)
      clearInterval(step)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="boot" role="status" aria-label="Booting" onClick={() => finish.current()}>
      <pre>{LINES.slice(0, shown).join('\n')}</pre>
      <div className="boot-bar" aria-hidden="true">
        <i />
      </div>
      <span className="boot-skip">Click or press any key to skip</span>
    </div>
  )
}
