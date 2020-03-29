import React from "react"
import { parseDemo } from "."

export const Home: React.FC = () => {
  return (
    <main>
      <input
        type="file"
        onChange={e => Array.from(e.target.files || []).forEach(parseDemo)}
      />
    </main>
  )
}
