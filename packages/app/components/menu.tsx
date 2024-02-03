import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faFile, faHome } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  Dialog,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import React from "react"
import { NavLink } from "react-router-dom"

import { LayoutContext } from "./layout"
import { DemoTabView } from "../demo/DemoTabView"
import { useToggle } from "../hooks"
import { useMatch } from "../hooks/useMatch"

// unused
export const MatchMenu: React.FC = () => {
  const { match } = useMatch()
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

const MenuLink: React.FC<{
  icon: IconProp
  label?: string
  divider?: boolean
  to: string
}> = ({ icon, label, divider, ...props }) => {
  const { showDrawer } = React.useContext(LayoutContext)
  return (
    <ListItemButton divider={divider} component={NavLink} {...props}>
      <ListItemIcon>
        <FontAwesomeIcon icon={icon} />
      </ListItemIcon>
      {showDrawer && <ListItemText primary={label} />}
    </ListItemButton>
  )
}

const MenuButton: React.FC<
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
    {import.meta.env.DEV && (
      <MenuLink icon={faFile} label="Files" to="/files" divider />
    )}
  </List>
)
