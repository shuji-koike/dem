import { Avatar, Menu, MenuItem, makeStyles } from "@material-ui/core"
import React from "react"

import { signIn, signOut, useAuth } from "../firebase/auth"

export const AuthButton: React.VFC = () => {
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

const useStyles = makeStyles((theme) => ({
  smallAvator: {
    cursor: "pointer",
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}))
