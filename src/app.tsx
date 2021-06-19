import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faFile, faHome, faTrophy } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  AppBar,
  Avatar,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  makeStyles,
} from "@material-ui/core"
import { Menu as MenuIcon } from "@material-ui/icons"
import React from "react"
import { NavLink } from "react-router-dom"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { signIn, signOut, useAuth } from "./firebase/auth"
import { DemoList } from "./pages/DemoList"
import { DemoPage } from "./pages/DemoPage"
import { Home } from "./pages/Home"
import { MatchList } from "./pages/MatchList"
import { Results } from "./pages/Results"
import { Sandbox } from "./pages/Sandbox"
import { MatchContextProvider } from "./store/MatchContext"

export const App: React.VFC = () => {
  return (
    <BrowserRouter>
      <MatchContextProvider>
        <Switch>
          <Route>
            <Layout nav={nav} menu={menu}>
              {routes}
            </Layout>
          </Route>
        </Switch>
      </MatchContextProvider>
    </BrowserRouter>
  )
}

const routes = (
  <Switch>
    <Route path="/files/*" component={DemoPage}></Route>
    <Route path="/files" component={DemoList}></Route>
    <Route path="/results" component={Results}></Route>
    <Route path="/matches" component={MatchList}></Route>
    <Route path="/sandbox" component={Sandbox}></Route>
    <Route path="/sample">
      <DemoPage path="/static/sample.json" />
    </Route>
    <Route path="/" component={Home}></Route>
  </Switch>
)

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

const nav = (
  <>
    <NavItem icon={faHome} to="/" label="Home" />
    <NavItem icon={faFile} to="/files" label="Files" />
    <NavItem icon={faTrophy} to="/results" label="Results" />
  </>
)

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

const menu = (
  <>
    <MenuListItem icon={faHome} to="/" exact label="Home" />
    <MenuListItem icon={faFile} to="/files" label="Files" />
    <MenuListItem icon={faTrophy} to="/results" label="Results" />
  </>
)

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
  const [layout, setLayout] = React.useState(new LayoutState())
  const MenuButton = () => (
    <IconButton
      edge="start"
      color="inherit"
      onClick={() => setLayout({ ...layout, showDrawer: !layout.showDrawer })}>
      <MenuIcon />
    </IconButton>
  )
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
      <Drawer open={layout.showDrawer}>
        <MenuButton />
        <List>{menu}</List>
      </Drawer>
      {children}
    </LayoutContext.Provider>
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

const AuthButton: React.VFC = () => {
  const user = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null)
  const open = (e: { currentTarget: Element }) => setAnchorEl(e.currentTarget)
  const close = () => setAnchorEl(null)
  const styles = useStyles()
  return (
    <>
      <Avatar
        className={styles.smallAvator}
        onClick={open}
        src={user?.photoURL ?? undefined}
      />
      {anchorEl &&
        (user ? (
          <Menu open anchorEl={anchorEl} onClose={close}>
            <MenuItem onClick={close}>Profile</MenuItem>
            <MenuItem onClick={close}>Settings</MenuItem>
            <MenuItem onClick={() => signOut().then(close)}>Sign out</MenuItem>
          </Menu>
        ) : (
          <Menu open anchorEl={anchorEl} onClose={close}>
            <MenuItem onClick={() => signIn("steam").then(close)}>
              Sign in with Steam
            </MenuItem>
            <MenuItem onClick={() => signIn("google").then(close)}>
              Sign in with Google
            </MenuItem>
            <MenuItem onClick={() => signIn("github").then(close)}>
              Sign in with Github
            </MenuItem>
          </Menu>
        ))}
    </>
  )
}

const useStyles = makeStyles(theme => ({
  smallAvator: {
    cursor: "pointer",
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}))
