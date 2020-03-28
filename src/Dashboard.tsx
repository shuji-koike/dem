import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import { NavLink } from "react-router-dom";

// https://git.io/JvUzq

export const Dashboard: React.FC<{
  title?: string;
  nav?: React.ReactNode;
  menu?: React.ReactNode;
}> = function({ title, nav = null, menu = null, children }) {
  return (
    <>
      <AppBar>
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap>
            <NavLink to="/">{title}</NavLink>
          </Typography>
          {nav}
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
};

export const NavItem: React.FC<{
  icon: IconProp;
  label?: string;
  to: string;
  exact?: boolean;
}> = ({ icon, label, ...props }) => (
  <Typography variant="h6">
    <NavLink {...props}>
      {icon && <FontAwesomeIcon icon={icon} />}
      {label}
    </NavLink>
  </Typography>
);

export const MenuItem: React.FC<{
  icon: IconProp;
  label?: string;
  divider?: boolean;
  to: string;
  exact?: boolean;
}> = ({ icon, label, divider, ...props }) => (
  <ListItem button divider={divider !== false} component={NavLink} {...props}>
    <ListItemIcon>
      <FontAwesomeIcon icon={icon} />
    </ListItemIcon>
    <ListItemText primary={label} />
  </ListItem>
);
