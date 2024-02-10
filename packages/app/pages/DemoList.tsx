import {
  faChevronDown,
  faChevronRight,
  faFileExcel,
  faFileImage,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { TreeItem, TreeView } from "@mui/lab"
import React from "react"
import { useNavigate } from "react-router-dom"

import { HeaderSlot } from "../components/layout"
import { storageList } from "../demo/io"
import { useAuth } from "../hooks"

export default function DemoList() {
  const user = useAuth()
  const [state, setState] = React.useState<string[]>()
  React.useEffect(() => {
    void (async function () {
      setState([
        ...(user ? await storageList(`private/${user.uid}`) : []),
        ...(await storageList("public")),
      ])
    })()
  }, [user?.uid])
  return (
    <main>
      <HeaderSlot>
        <h1>Files</h1>
      </HeaderSlot>
      <TreeView
        defaultCollapseIcon={<FontAwesomeIcon icon={faChevronRight} />}
        defaultExpandIcon={<FontAwesomeIcon icon={faChevronDown} />}
      >
        {state?.map((e) => <DemoItem key={e} nodeId={e} file={e} />)}
      </TreeView>
    </main>
  )
}

const DemoItem: React.FC<{
  file: string
  nodeId: string
}> = ({ file, nodeId }) => {
  const navigate = useNavigate()
  return (
    <TreeItem
      nodeId={nodeId}
      icon={
        <FontAwesomeIcon
          icon={
            /\.dem(\.json)?(\.gz)?$/i.test(file) ? faFileImage : faFileExcel
          }
        />
      }
      onClick={() => navigate(`/dem/${file}/`)}
      label={file}
    />
  )
}
