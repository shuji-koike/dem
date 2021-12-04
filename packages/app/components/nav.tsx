import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faFile, faHome, faTrophy } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core"
import React from "react"
import { NavLink } from "react-router-dom"

const MenuListItem: React.VFC<{
  icon: IconProp
  label?: string
  divider?: boolean
  to: string
}> = ({ icon, label, divider, ...props }) => (
  <ListItem button divider={divider} component={NavLink} {...props}>
    <ListItemIcon>
      <FontAwesomeIcon icon={icon} />
    </ListItemIcon>
    <ListItemText primary={label} />
  </ListItem>
)

export const menu = (
  <List>
    <MenuListItem icon={faHome} to="/" label="Home" />
    <MenuListItem icon={faFile} to="/files" label="Files" />
    <MenuListItem icon={faTrophy} to="/sample" label="Sample" />
  </List>
)
