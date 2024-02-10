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
import React, { useEffect, useRef } from "react"
import ReactDOM from "react-dom"
import { useLocation, NavLink, Link } from "react-router-dom"

import { AuthAvatar } from "./AuthAvatar"
import { useLayout } from "../hooks/useLayout"

// https://git.io/JvUzq
export const Layout: React.FC<{
  title?: string
  nav?: React.ReactNode
  menu?: React.ReactNode
  children: React.ReactNode
}> = ({ title, nav, menu, children }) => {
  const location = useLocation()
  const { hideHeader, showDrawer, setLayout } = useLayout()
  const drawer = useRef<React.ElementRef<typeof Drawer>>(null)
  useEffect(() => setLayout({ showDrawer: false }), [location])
  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      if (event.clientX < 50 && !showDrawer) setLayout({ showDrawer: true })
    }
    document.addEventListener("mousemove", onMouseMove)
    return () => document.removeEventListener("mousemove", onMouseMove)
  }, [showDrawer])
  return (
    <>
      <AppBar
        color="transparent"
        css={style}
        sx={{ display: hideHeader ? "none" : undefined }}
      >
        <Toolbar variant="dense">
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
        ref={drawer}
        open={showDrawer}
        onClose={() => setLayout({ showDrawer: false })}
      >
        <Toolbar sx={{ width: 300 }}>
          <MenuButton />
        </Toolbar>
        {menu}
      </Drawer>
      {children}
    </>
  )
}

const MenuButton: React.FC = () => {
  const { showDrawer, setLayout } = useLayout()
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

export const HeaderSlot: React.FC<{
  children?: React.ReactNode
}> = ({ children = logo }) => {
  const container = document.getElementById("header-portal")
  return container ? ReactDOM.createPortal(children, container) : null
}

// TODO
const logo = (
  <Link to="/">
    <Typography variant="h1" />
  </Link>
)

const style = css`
  position: sticky;
  backdrop-filter: blur(1px);
  h1 {
    font-size: 1.5rem;
    margin: 0;
  }
`
