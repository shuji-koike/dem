import { Adjust, ChevronRight, ExpandMore } from "@material-ui/icons"
import { TreeItem, TreeView } from "@material-ui/lab"
import React from "react"
import { Link, useHistory } from "react-router-dom"

import { storageList, fetchFiles } from "../io"

export const DemoList: React.VFC = () => {
  const [state, setState] = React.useState<string[]>()
  React.useEffect(() => void storageList("sandbox").then(setState), [])
  return (
    <main>
      <h1>Matches</h1>
      <TreeView
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
      >
        {state?.map((e) => (
          <DemoItem key={e} nodeId={e} file={e} />
        ))}
      </TreeView>
    </main>
  )
}

const DemoItem: React.VFC<{
  file: string
  nodeId: string
}> = ({ file, nodeId }) => {
  const history = useHistory()
  if (/\.dem$/.test(file))
    return (
      <TreeItem
        nodeId={nodeId}
        icon={<Adjust />}
        label={<Link to={`/files/${file}`}>{file}</Link>}
      />
    )
  else if (/\.rar$/.test(file)) return <RarItem file={file} />
  return (
    <TreeItem
      nodeId={nodeId}
      label={file}
      onClick={() => history.push(`files/${file}`)}
    />
  )
}

const RarItem: React.VFC<{
  file: string
}> = ({ file }) => {
  const [data, setData] = React.useState<string[]>([])
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => void (open && fetchFiles(file).then(setData)), [open])
  return (
    <TreeItem nodeId={file} label={file} onClick={() => setOpen(!open)}>
      {open ? (
        data.map((e, i) => (
          <TreeItem
            key={e}
            nodeId={e}
            icon={<Adjust />}
            label={
              <Link key={i} to={`/files/${file}?file=${e}`}>
                {e}
              </Link>
            }
          />
        ))
      ) : (
        <></>
      )}
    </TreeItem>
  )
}
