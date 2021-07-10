import {
  AppBar,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core"
import { ChevronLeft, Menu } from "@material-ui/icons"
import React from "react"
import ReactDOM from "react-dom"
import { NavLink, useLocation } from "react-router-dom"

import { AuthButton } from "./auth"

interface LayoutState {
  hideHeader?: boolean
  showDrawer?: boolean
  nav?: React.ReactNode
  setLayout?: (state: LayoutState) => void
}

export const LayoutContext = React.createContext<LayoutState>({})

// https://git.io/JvUzq
export const Layout: React.VFC<{
  title?: string
  nav?: React.ReactNode
  menu?: React.ReactNode
  children: React.ReactNode
}> = ({ title, nav, menu, children }) => {
  const location = useLocation()
  const [layout, setLayout] = React.useState<LayoutState>({})
  React.useEffect(() => setLayout({ ...layout, showDrawer: false }), [location])
  return (
    <LayoutContext.Provider value={{ ...layout, setLayout }}>
      <CssBaseline />
      <AppBar color="transparent" style={{ top: layout.hideHeader ? -60 : 0 }}>
        <Toolbar variant="dense">
          <MenuButton />
          {title && (
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              <NavLink to="/">{title}</NavLink>
            </Typography>
          )}
          {layout.nav ?? nav}
          <div id="header-portal"></div>
          <div style={{ flexGrow: 1 }}></div>
          <AuthButton />
        </Toolbar>
      </AppBar>
      <Drawer
        open={layout.showDrawer}
        onClose={() => setLayout({ ...layout, showDrawer: false })}
      >
        <Toolbar variant="dense" style={{ minWidth: 240 }}>
          <MenuButton />
        </Toolbar>
        {menu}
      </Drawer>
      {children}
    </LayoutContext.Provider>
  )
}

const MenuButton: React.VFC = () => {
  const { showDrawer, ...layout } = React.useContext(LayoutContext)
  return (
    <IconButton
      edge="start"
      color="inherit"
      onClick={() => layout.setLayout?.({ ...layout, showDrawer: !showDrawer })}
    >
      {showDrawer ? <ChevronLeft /> : <Menu />}
    </IconButton>
  )
}

export const HeaderSlot: React.VFC<{
  children: React.ReactNode
}> = ({ children }) => {
  const container = document.getElementById("header-portal")
  return container ? ReactDOM.createPortal(children, container) : null
}
