import { css } from "@emotion/react"
import React from "react"

import { BrowserAlert } from "../components/BrowserAlert"
import { FilePicker } from "../demo/DemoFilePicker"
import { MatchView } from "../demo/MatchView"
import { useDropFile } from "../hooks/useDropFile"
import { useMatch } from "../hooks/useMatch"

export default function Home() {
  const match = useMatch((state) => state.match)
  const setFiles = useMatch((state) => state.setFiles)
  useDropFile(setFiles)
  return match?.Rounds?.length ? (
    <MatchView />
  ) : (
    <article css={style}>
      <BrowserAlert />
      <FilePicker />
    </article>
  )
}

const style = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
