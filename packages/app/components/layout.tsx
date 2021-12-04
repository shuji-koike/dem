import { css } from "@emotion/react"
import {
  AppBar,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core"
import { ChevronLeft, Menu } from "@material-ui/icons"
import { Box } from "@primer/components"
import React from "react"
import ReactDOM from "react-dom"
import { NavLink, useLocation } from "react-router-dom"

import { AuthButton } from "./auth"

interface LayoutState {
  hideHeader: boolean
  showDrawer: boolean
  fixedHeight: number
  nav?: React.ReactNode
  setLayout: (
    state: LayoutState | ((state: LayoutState) => LayoutState)
  ) => void
}

const layoutState = Object.freeze<LayoutState>({
  hideHeader: false,
  showDrawer: false,
  fixedHeight: 54,
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
  const [layout, setLayout] = React.useState<LayoutState>(layoutState)
  React.useEffect(() => setLayout({ ...layout, showDrawer: false }), [location])
  return (
    <LayoutContext.Provider value={{ ...layout, setLayout }}>
      <CssBaseline />
      <AppBar
        color="transparent"
        css={css`
          display: ${layout.hideHeader && "none"};
        `}
      >
        <Toolbar
          variant="dense"
          css={css`
            min-height: ${layout.fixedHeight}px;
            max-height: ${layout.fixedHeight}px;
          `}
        >
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
              flex-grow: 1;
              margin-left: 16px;
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
        onClose={() => setLayout({ ...layout, showDrawer: false })}
      >
        <Toolbar variant="dense">
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
      edge="start"
      color="inherit"
      size="small"
      onClick={() =>
        setLayout((layout) => ({ ...layout, showDrawer: !showDrawer }))
      }
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
