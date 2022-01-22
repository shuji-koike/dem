import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faFile, faHome } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
} from "@mui/material"
import React, { useContext } from "react"
import { NavLink, Route, Routes } from "react-router-dom"

import { AppContext } from "../app"
import { DemoTabView } from "../demo/DemoTabView"
import { useToggle } from "../hooks"
import { LayoutContext } from "./layout"

const MatchMenu: React.VFC = () => {
  const { match } = useContext(AppContext)
  const open = useToggle()
  return (
    <>
      <MenuButton icon={faHome} label="Score" />
      <Dialog open={open.state}>
        {open.state && match && <DemoTabView match={match} />}
      </Dialog>
    </>
  )
}

const MenuLink: React.VFC<{
  icon: IconProp
  label?: string
  divider?: boolean
  to: string
}> = ({ icon, label, divider, ...props }) => {
  const { showDrawer } = React.useContext(LayoutContext)
  return (
    <ListItem button divider={divider} component={NavLink} {...props}>
      <ListItemIcon>
        <FontAwesomeIcon icon={icon} />
      </ListItemIcon>
      {showDrawer && <ListItemText primary={label} />}
    </ListItem>
  )
}

const MenuButton: React.VFC<
  React.ComponentProps<typeof ListItemButton> & {
    icon: IconProp
    label?: string
  }
> = ({ icon, label, ...props }) => {
  const { showDrawer } = React.useContext(LayoutContext)
  return (
    <ListItemButton {...props}>
      <ListItemIcon>
        <FontAwesomeIcon icon={icon} />
      </ListItemIcon>
      {showDrawer && <ListItemText primary={label} />}
    </ListItemButton>
  )
}

export const menu = (
  <List>
    <MenuLink icon={faHome} label="Home" to="/" />
    <MenuLink icon={faFile} label="Files" to="/files" divider />
    <Routes>
      <Route path="/dem/*" element={<MatchMenu />} />
      <Route path="*" element="" />
    </Routes>
  </List>
)
