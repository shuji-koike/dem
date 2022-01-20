import { Alert } from "@mui/lab"
import React from "react"
import { isChrome } from "react-device-detect"
import { useNavigate } from "react-router"

import { AppContext } from "../app"
import { HeaderSlot } from "../components/layout"
import { Match } from "../demo/Match"
import { useFileDrop } from "../hooks"
import { openDemo } from "../io"

export const Home: React.VFC = () => {
  const navigate = useNavigate()
  const { match, setMatch } = React.useContext(AppContext)
  const [output, setOutput] = React.useState<string[]>([])
  const [files, setFiles] = React.useState<File[]>()
  React.useEffect(() => {
    if (files) openDemo(files[0], setOutput, setMatch).then(setMatch)
  }, [files])
  useFileDrop(setFiles) // FIXME
  return match ? (
    <Match match={match} />
  ) : (
    <article>
      <HeaderSlot />
      {isChrome || (
        <Alert color="warning">Only Google Chrome is supported!</Alert>
      )}
      <p>Click the button below and select a DEM file.</p>
      <input
        type="file"
        accept=".dem,.json,.gz"
        disabled={output.length > 0}
        onChange={(e) => setFiles([...(e.currentTarget.files || [])])}
      />
      {output.length > 0 && (
        <pre>
          <p>Wait patiently. May take up to few minutes.</p>
          {output.join("\n")}
        </pre>
      )}
      {import.meta.env.DEV && (
        <nav className="debug">
          <button onClick={() => navigate("/sample")}>
            Open a sample File
          </button>
        </nav>
      )}
    </article>
  )
}
