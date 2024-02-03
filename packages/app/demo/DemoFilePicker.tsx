import { InfoOutlined, HourglassBottomOutlined } from "@mui/icons-material"
import { Alert, Box } from "@mui/material"
import React from "react"
import { useNavigate } from "react-router"

import { isValidFile } from "./io"
import { useFiles } from "../hooks/useFiles"

export const FilePicker: React.FC = () => {
  const { file, files, setFiles, output } = useFiles()
  const navigate = useNavigate()
  return (
    <>
      <Alert icon={<InfoOutlined />}>
        <Box marginBottom={2}>
          Drag and drop a ".dem" file into this window.
          <br /> Or click the button below and select a ".dem" file.
        </Box>
        <input
          type="file"
          accept=".dem,.rar,.json,.gz"
          disabled={!!files?.length}
          onChange={(e) => setFiles(e.currentTarget.files)}
        />
        {import.meta.env.DEV && (
          <button
            className="debug"
            disabled={!!files?.length}
            onClick={() => navigate("/dem/sample")}
          >
            Open a sample File
          </button>
        )}
      </Alert>
      {file && isValidFile(file) && (
        <Alert>DEM File selected. Analyzing process starting...</Alert>
      )}
      {output.length > 0 && (
        <Alert icon={<HourglassBottomOutlined />}>
          <pre css={{ fontSize: 12, color: "darkgreen" }}>
            <p>Parsing DEM file {file?.name}</p>
            {output.map((e, i) => (
              <p key={i}>{e}</p>
            ))}
          </pre>
        </Alert>
      )}
      {files && files?.length > 1 && (
        <Alert>
          Select a file to extract.
          <ul>
            {files.map((e, i) => (
              <li key={i}>
                <label>
                  <input type="checkbox" onChange={() => setFiles([e])} />
                  <span css={{ cursor: "pointer" }}>{e.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </Alert>
      )}
    </>
  )
}
