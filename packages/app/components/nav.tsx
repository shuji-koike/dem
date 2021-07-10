import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faFile, faHome, faTrophy } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core"
import React from "react"
import { NavLink } from "react-router-dom"

/** @deprecated */
const NavItem: React.VFC<{
  icon: IconProp
  label?: string
  to: string
  exact?: boolean
}> = ({ icon, label, ...props }) => (
  <Typography variant="h6">
    <NavLink {...props}>
      {icon && <FontAwesomeIcon icon={icon} />}
      {label}
    </NavLink>
  </Typography>
)

/** @deprecated */
export const nav = (
  <>
    <NavItem icon={faHome} to="/" label="Home" />
    <NavItem icon={faFile} to="/files" label="Files" />
    <NavItem icon={faTrophy} to="/results" label="Results" />
  </>
)

/** @deprecated */
const MenuListItem: React.VFC<{
  icon: IconProp
  label?: string
  divider?: boolean
  to: string
  exact?: boolean
}> = ({ icon, label, divider, ...props }) => (
  <ListItem button divider={divider ?? false} component={NavLink} {...props}>
    <ListItemIcon>
      <FontAwesomeIcon icon={icon} />
    </ListItemIcon>
    <ListItemText primary={label} />
  </ListItem>
)

/** @deprecated */
export const menu = (
  <List>
    <MenuListItem icon={faHome} to="/" exact label="Home" />
    <MenuListItem icon={faFile} to="/files" label="Files" />
    <MenuListItem icon={faTrophy} to="/results" label="Results" />
  </List>
)
