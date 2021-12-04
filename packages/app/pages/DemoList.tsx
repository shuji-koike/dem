import { faFileImage, faFileExcel } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ChevronRight, ExpandMore } from "@material-ui/icons"
import { TreeItem, TreeView } from "@material-ui/lab"
import React from "react"
import { useNavigate } from "react-router-dom"

import { HeaderSlot } from "../components/layout"
import { useAuth } from "../hooks"
import { storageList } from "../io"

export const DemoList: React.VFC = () => {
  const user = useAuth()
  const [state, setState] = React.useState<string[]>()
  const path = user ? `private/${user.uid}` : "public"
  React.useEffect(() => void storageList(path).then(setState), [path])
  return (
    <main>
      <HeaderSlot>
        <h1>Matches</h1>
      </HeaderSlot>
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
  const navigate = useNavigate()
  return (
    <TreeItem
      nodeId={nodeId}
      icon={
        <FontAwesomeIcon
          icon={/\.dem(\.json)?(\.gz)?$/.test(file) ? faFileImage : faFileExcel}
        />
      }
      onClick={() => navigate(`/files/${file}`)}
      label={file}
    />
  )
}
