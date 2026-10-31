import { skillGroups } from '../content/data'

export default function Skills() {
  return (
    <>
      {skillGroups.map((g) => (
        <section key={g.name}>
          <h3>{g.name}</h3>
          <ul className="tag-list">
            {g.items.map((i) => (
              <li key={i} className="tag">{i}</li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
