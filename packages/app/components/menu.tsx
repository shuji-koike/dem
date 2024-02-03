import { Home, StorageOutlined } from "@mui/icons-material"
import {
  Dialog,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import React from "react"
import { NavLink } from "react-router-dom"

import { DemoTabView } from "../demo/DemoTabView"
import { useToggle } from "../hooks"
import { useMatch } from "../hooks/useMatch"

// unused
export const MatchMenu: React.FC = () => {
  const { match } = useMatch()
  const open = useToggle()
  return (
    <>
      <ListItemButton>
        <ListItemIcon>
          <Home />
        </ListItemIcon>
        <ListItemText primary="Score" />
      </ListItemButton>
      <Dialog open={open.state}>
        {open.state && match && <DemoTabView match={match} />}
      </Dialog>
    </>
  )
}

export const menu = (
  <List>
    <ListItemButton component={NavLink} to="/">
      <ListItemIcon>
        <Home />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItemButton>
    {import.meta.env.DEV && (
      <ListItemButton component={NavLink} to="/files" divider>
        <ListItemIcon>
          <StorageOutlined />
        </ListItemIcon>
        <ListItemText primary="Files" />
      </ListItemButton>
    )}
  </List>
)
