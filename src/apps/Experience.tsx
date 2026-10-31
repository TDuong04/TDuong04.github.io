import { jobs } from '../content/data'

export default function Experience() {
  return (
    <>
      {jobs.map((j) => (
        <section key={j.id}>
          <h3>{j.role}, {j.org}</h3>
          <p><em>{j.period}</em></p>
          <p>{j.summary}</p>
        </section>
      ))}
    </>
  )
}
