import React from "react"

export const DebugView: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <section>
      <pre>
        {JSON.stringify({
          ...match,
          Rounds: undefined,
          KillEvents: undefined,
          NadeEvents: undefined,
        })}
      </pre>
      <section>
        {match.Rounds?.map((e, i) => (
          <pre key={i}>
            {JSON.stringify({
              ...e,
              Frames: undefined,
              length: e.Frames.length,
            })}
          </pre>
        ))}
      </section>
      <section>
        {[...match.KillEvents, ...match.NadeEvents].map((e, i) => (
          <pre key={i}>{JSON.stringify(e)}</pre>
        ))}
      </section>
    </section>
  )
}
