import Adjust from "@material-ui/icons/Adjust"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import TreeItem, { TreeItemProps } from "@material-ui/lab/TreeItem"
import TreeView from "@material-ui/lab/TreeView"
import axios from "axios"
import React from "react"
import { Link } from "react-router-dom"

export const DemoList: React.FC = () => {
  const [state, setState] = React.useState<string[]>([])
  React.useEffect(() => {
    axios.get("/api/files").then(({ data }) => setState(data))
  }, [])
  return (
    <main>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}>
        {state.map(e => (
          <DemoItem key={e} nodeId={e} file={e}></DemoItem>
        ))}
      </TreeView>
    </main>
  )
}

const DemoItem: React.FC<{
  file: string
} & TreeItemProps> = ({ file, nodeId }) => {
  if (/\.dem$/.test(file)) {
    return (
      <TreeItem
        nodeId={nodeId}
        icon={<Adjust />}
        label={<Link to={`/files/${file}`}>{file}</Link>}></TreeItem>
    )
  } else if (/\.rar$/.test(file)) {
    return <RarItem file={file} />
  }
  return <TreeItem nodeId={nodeId} label={file}></TreeItem>
}

const RarItem: React.FC<{
  file: string
}> = ({ file }) => {
  const [data, setData] = React.useState([])
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    open && axios.get(`/api/files/${file}`).then(({ data }) => setData(data))
  }, [open])
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
