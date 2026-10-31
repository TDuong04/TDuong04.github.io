export type Link = { label: string; url: string }

export type Project = {
  id: string
  title: string
  period?: string
  summary: string
  tags: string[]
  links: Link[]
}

export type Job = {
  id: string
  role: string
  org: string
  period: string
  summary: string
}

export type SkillGroup = { name: string; items: string[] }

export type Profile = {
  name: string
  role: string
  email: string
  github: string
  linkedin: string
  highlights: string[]
  education: string
}
