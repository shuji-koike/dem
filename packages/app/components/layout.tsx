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
import { NavLink, useLocation } from "react-router-dom"

import { AuthButton } from "./auth"

class LayoutState {
  showHeader = true
  showDrawer = false
  nav: React.ReactNode = null
}

export const LayoutContext = React.createContext<{
  layout: LayoutState
  setLayout: (layout: LayoutState) => void
}>({
  layout: new LayoutState(),
  setLayout: () => undefined,
})

// https://git.io/JvUzq
export const Layout: React.VFC<{
  title?: string
  nav?: React.ReactNode
  menu?: React.ReactNode
  children: React.ReactNode
}> = ({ title, nav, menu, children }) => {
  const location = useLocation()
  const [layout, setLayout] = React.useState(new LayoutState())
  React.useEffect(() => setLayout({ ...layout, showDrawer: false }), [location])
  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      <CssBaseline />
      <AppBar color="transparent" style={{ top: layout.showHeader ? 0 : -60 }}>
        <Toolbar variant="dense">
          <MenuButton />
          {title && (
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              <NavLink to="/">{title}</NavLink>
            </Typography>
          )}
          {layout.nav ?? nav}
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
  const { layout, setLayout } = React.useContext(LayoutContext)
  return (
    <IconButton
      edge="start"
      color="inherit"
      onClick={() => setLayout({ ...layout, showDrawer: !layout.showDrawer })}
    >
      {layout.showDrawer ? <ChevronLeft /> : <Menu />}
    </IconButton>
  )
}

export const HeaderSlot: React.VFC<{
  deps?: ReadonlyArray<unknown>
  children: React.ReactNode
}> = ({ deps, children }) => {
  const { layout, setLayout } = React.useContext(LayoutContext)
  React.useEffect(() => {
    setLayout({ ...layout, nav: children })
    return () => setLayout({ ...layout, nav: null })
  }, deps)
  return <></>
}
