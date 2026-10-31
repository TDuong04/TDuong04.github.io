import type { ComponentType } from 'react'
import { projects } from '../content/data'
import type { IconDef, Resolve } from '../ui/Desktop'
import Contact from './Contact'
import Experience from './Experience'
import ProjectDetail from './ProjectDetail'
import Projects from './Projects'
import Resume from './Resume'
import Skills from './Skills'
import Welcome from './Welcome'

type Entry = { title: string; Component: ComponentType }

const top: (IconDef & Entry)[] = [
  { id: 'welcome', label: 'Welcome', glyph: '👋', title: 'Welcome.exe', Component: Welcome },
  { id: 'projects', label: 'My Projects', glyph: '📁', title: 'My Projects', Component: Projects },
  { id: 'experience', label: 'Experience', glyph: '💼', title: 'Experience', Component: Experience },
  { id: 'skills', label: 'Skills', glyph: '🛠️', title: 'Skills', Component: Skills },
  { id: 'resume', label: 'Resume', glyph: '📄', title: 'Resume.txt', Component: Resume },
  { id: 'contact', label: 'Contact', glyph: '✉️', title: 'Contact', Component: Contact },
]

// Built once so component identity is stable (no remount on every render).
const entries = new Map<string, Entry>(top.map((t) => [t.id, t]))
for (const p of projects) {
  entries.set(`projects/${p.id}`, {
    title: p.title,
    Component: () => <ProjectDetail project={p} />,
  })
}

export const icons: IconDef[] = top.map(({ id, label, glyph }) => ({ id, label, glyph }))
export const resolve: Resolve = (id) => entries.get(id) ?? null
export const isValidId = (id: string) => entries.has(id)
