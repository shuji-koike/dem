import { css } from "@emotion/react"
import { faBars, faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material"
import React from "react"
import ReactDOM from "react-dom"
import { useLocation, NavLink, Link } from "react-router-dom"

import { AuthAvatar } from "./AuthAvatar"

interface LayoutState {
  hideHeader: boolean
  showDrawer: boolean
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
          backdrop-filter: blur(1px);
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
          {nav}
          <Box
            id="header-portal"
            flex={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            margin="0 32px"
          />
          <AuthAvatar />
        </Toolbar>
      </AppBar>
      <Drawer
        open={layout.showDrawer}
        onClose={() => setLayout({ showDrawer: false })}
      >
        <Toolbar sx={{ width: 300 }}>
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
      sx={{ width: 42, height: 42 }}
      onClick={() => setLayout({ showDrawer: !showDrawer })}
    >
      <FontAwesomeIcon icon={showDrawer ? faChevronLeft : faBars} />
    </IconButton>
  )
}

export const HeaderSlot: React.VFC<{
  children?: React.ReactNode
}> = ({ children = logo }) => {
  const container = document.getElementById("header-portal")
  return container ? ReactDOM.createPortal(children, container) : null
}

// TODO
const logo = (
  <Link to="/">
    <Typography variant="h1"></Typography>
  </Link>
)
