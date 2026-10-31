import type { ComponentType } from 'react'
import { useWindowManager } from '../wm/WindowManager'
import Icon, { type IconProps } from './Icon'
import Taskbar from './Taskbar'
import Window from './Window'

export type IconDef = IconProps
export type Resolve = (id: string) => { title: string; Component: ComponentType } | null

export default function Desktop({ icons, resolve }: { icons: IconDef[]; resolve: Resolve }) {
  const { state } = useWindowManager()
  return (
    <div className="desktop">
      <div className="icon-grid">
        {icons.map((i) => (
          <Icon key={i.id} {...i} />
        ))}
      </div>
      {state.windows.map((w) => {
        const app = resolve(w.id)
        if (!app) return null
        const { Component } = app
        return (
          <Window key={w.id} id={w.id} title={app.title}>
            <Component />
          </Window>
        )
      })}
      <Taskbar icons={icons} titleOf={(id) => resolve(id)?.title ?? id} />
    </div>
  )
}
