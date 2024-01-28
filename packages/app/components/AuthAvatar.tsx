import { css } from "@emotion/react"
import ContentCopy from "@mui/icons-material/ContentCopy"
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material"
import {
  GoogleAuthProvider,
  OAuthProvider,
  getAuth,
  signInWithPopup,
} from "firebase/auth"
import React from "react"

import { useAuth } from "../hooks"

export const AuthAvatar: React.FC<{
  diameter?: number
}> = ({ diameter = 32 }) => {
  const user = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null)
  const close = () => setAnchorEl(null)
  return (
    <>
      <Avatar
        onClick={(e) => setAnchorEl(e.currentTarget)}
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
            <MenuItem
              onClick={async () => {
                await getAuth().signOut()
                location.reload()
              }}
            >
              Sign out
            </MenuItem>
            <Divider />
            <MenuItem disableRipple>
              <Box width="20em" display="flex" flexDirection="column" gap={1}>
                <ButtonGroup size="small">
                  <Button>
                    <Typography fontSize={10}>user.id:{user.uid}</Typography>
                  </Button>
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(`user.id:${user.uid}`)
                    }
                  >
                    <ContentCopy />
                  </Button>
                </ButtonGroup>
                <Alert
                  color="info"
                  sx={{ minWidth: "20em", whiteSpace: "pre-wrap" }}
                >
                  When reporting an issue, please include your user ID to help
                  me track down the problem.
                </Alert>
              </Box>
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
                color="warning"
                sx={{ minWidth: "20em", whiteSpace: "pre-wrap" }}
              >
                Currently, there is no additional functionality behind signing
                in.
                <br />
                Although, when a problem or bug is found or reported, it may be
                easier for me to track down the issue if you are signed in.
                <br />I will <em>NOT</em> contact you unless you contact me
                first.
              </Alert>
            </MenuItem>
          </Menu>
        ))}
    </>
  )
}
