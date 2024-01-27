import { css } from "@emotion/react"
import { Alert, Avatar, Divider, Menu, MenuItem } from "@mui/material"
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import React from "react"

import { useAuth } from "../hooks"

export const AuthAvatar: React.FC<{
  diameter?: number
}> = ({ diameter = 32 }) => {
  const user = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null)
  const open = (e: { currentTarget: Element }) => setAnchorEl(e.currentTarget)
  const close = () => setAnchorEl(null)
  return (
    <>
      <Avatar
        onClick={open}
        src={user?.photoURL ?? undefined}
        css={css`
          cursor: pointer;
          width: ${diameter}px;
          height: ${diameter}px;
        `}
      />
      {anchorEl &&
        (user ? (
          <Menu open anchorEl={anchorEl} onClose={close}>
            <MenuItem onClick={close}>Profile</MenuItem>
            <MenuItem onClick={close}>Settings</MenuItem>
            <MenuItem onClick={() => getAuth().signOut().then(close)}>
              Sign out
            </MenuItem>
          </Menu>
        ) : (
          <Menu open anchorEl={anchorEl} onClose={close}>
            <MenuItem
              onClick={() =>
                signInWithPopup(getAuth(), new GoogleAuthProvider()).then(close)
              }
            >
              Sign in with Google
            </MenuItem>

            <MenuItem
              disabled
              onClick={() =>
                signInWithPopup(getAuth(), new OAuthProvider("steam")).then(
                  close,
                )
              }
            >
              Sign in with Steam (coming soon)
            </MenuItem>
            <Divider />
            <MenuItem disabled>
              <Alert
                color="info"
                sx={{ width: "20em", whiteSpace: "pre-wrap" }}
              >
                Currently, there is no additional functionality behind signing
                in. <br />
                Although, when a problem or bug is found or reported, it may be
                easier for me to track down the issue if you are signed in.
                <br />I will not contact you unless you contact me first.
              </Alert>
            </MenuItem>
          </Menu>
        ))}
    </>
  )
}
