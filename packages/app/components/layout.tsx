import { css } from "@emotion/react"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faBars, faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import React from "react"
import ReactDOM from "react-dom"
import { useLocation, NavLink } from "react-router-dom"

import { AuthButton } from "./auth"

interface LayoutState {
  hideHeader: boolean
  showDrawer: boolean
  nav?: React.ReactNode
  setLayout: (state: Partial<LayoutState>) => void
}

const layoutState = Object.freeze<LayoutState>({
  hideHeader: false,
  showDrawer: false,
  setLayout() {},
})

export const LayoutContext = React.createContext<LayoutState>(layoutState)

// https://git.io/JvUzq
export const Layout: React.VFC<{
  title?: string
  nav?: React.ReactNode
  menu?: React.ReactNode
  children: React.ReactNode
}> = ({ title, nav, menu, children }) => {
  const location = useLocation()
  const [layout, setState] = React.useState<LayoutState>(layoutState)
  function setLayout(layout: Partial<LayoutState>) {
    setState((state) => ({ ...state, ...layout }))
  }
  React.useEffect(() => setLayout({ showDrawer: false }), [location])
  return (
    <LayoutContext.Provider value={{ ...layout, setLayout }}>
      <AppBar
        color="transparent"
        css={css`
          display: ${layout.hideHeader && "none"};
          position: sticky;
          h1 {
            font-size: 1.5rem;
            margin: 0;
          }
        `}
      >
        <Toolbar>
          <MenuButton />
          {title && (
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              <NavLink to="/">{title}</NavLink>
            </Typography>
          )}
          {layout.nav ?? nav}
          <Box
            id="header-portal"
            css={css`
              display: flex;
              margin: 0 16px;
              flex: 1;
              justify-content: space-between;
              & > h1:not(:first-of-type) {
                display: none;
              }
            `}
          />
          <AuthButton />
        </Toolbar>
      </AppBar>
      <Drawer
        open={layout.showDrawer}
        onClose={() => setLayout({ showDrawer: false })}
      >
        <Toolbar>
          <MenuButton />
        </Toolbar>
        {menu}
      </Drawer>
      {children}
    </LayoutContext.Provider>
  )
}

const MenuButton: React.VFC = () => {
  const { showDrawer, setLayout } = React.useContext(LayoutContext)
  return (
    <IconButton
      size="small"
      css={css`
        width: 42px;
        height: 42px;
      `}
      onClick={() => setLayout({ showDrawer: !showDrawer })}
    >
      <FontAwesomeIcon icon={showDrawer ? faChevronLeft : faBars} />
    </IconButton>
  )
}

export const MenuItem: React.VFC<{
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

export const HeaderSlot: React.VFC<{
  children: React.ReactNode
}> = ({ children }) => {
  const container = document.getElementById("header-portal")
  return container ? ReactDOM.createPortal(children, container) : null
}
