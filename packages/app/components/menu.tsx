import { FileOpen, Home, StorageOutlined } from "@mui/icons-material"
import {
  Collapse,
  Dialog,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import React from "react"
import { NavLink } from "react-router-dom"

import { DebugNav } from "../demo/DebugNav"
import { DemoTabView } from "../demo/DemoTabView"
import { useToggle } from "../hooks"
import { useMatch } from "../hooks/useMatch"

export const Menu: React.FC = () => {
  const match = useMatch((state) => state.match)
  const matchs = useMatch((state) => state.matchs)
  const setMatch = useMatch((state) => state.setMatch)
  const selectMatch = useMatch((state) => state.selectMatch)
  const open = useToggle()
  return (
    <List dense>
      <ListItemButton component={NavLink} to="/" onClick={() => setMatch(null)}>
        <ListItemIcon>
          <Home />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
      {!!matchs.length && (
        <ListItemButton disabled>
          <ListItemIcon>
            <StorageOutlined />
          </ListItemIcon>
          <ListItemText primary="Files" />
        </ListItemButton>
      )}
      <Collapse in timeout="auto" unmountOnExit>
        <List dense sx={{ pl: 2 }}>
          {matchs.map((match) => (
            <ListItemButton key={match.UUID} onClick={() => selectMatch(match)}>
              <ListItemIcon>
                <FileOpen />
              </ListItemIcon>
              <ListItemText primary={match.FileName} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
      {import.meta.env.DEV && <DebugNav />}
      <Dialog open={open.state}>
        {open.state && match && <DemoTabView match={match} />}
      </Dialog>
    </List>
  )
}
