import { css } from "@emotion/react"
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

import { teamColor } from "."

export const DemoNav: React.FC<{
  match: Pick<Match, "Rounds" | "Ended">
  round?: Round
  onChange?: (round: Round) => void
}> = ({ match, round, onChange }) => {
  return (
    <>
      {match.Rounds?.map((e) => (
        <DemoNavItem
          key={e.Tick}
          active={e.Round === round?.Round}
          color={teamColor(e.Winner)}
          onClick={() => onChange?.(e)}
        >
          {e.Round + 1}
        </DemoNavItem>
      ))}
      {!match.Ended && (
        <>
          <DemoNavItem>
            <FontAwesomeIcon icon={faSyncAlt} size="sm" color="#444" spin />
          </DemoNavItem>
          {[...Array(Math.max(0, 16 - (match.Rounds?.length ?? 0)))].map(
            (_, i) => (
              <DemoNavItem key={i}>
                <FontAwesomeIcon icon={faSyncAlt} size="xs" color="#333" />
              </DemoNavItem>
            ),
          )}
        </>
      )}
    </>
  )
}

const DemoNavItem: React.FC<{
  active?: boolean
  size?: number
  color?: string
  onClick?: () => void
  children?: React.ReactNode
}> = ({ active, size = 32, color, onClick, children }) => {
  const style = css`
    display: inline-block;
    width: ${size}px;
    height: ${size}px;
    line-height: ${size}px;
    border-radius: ${size / 2}px;
    text-align: center;
    font-family: monospace;
    color: ${color};
    cursor: ${onClick && "pointer"};
    font-weight: bold;
    filter: brightness(80%);
    ${active ? "&" : "&:hover"} {
      color: #fff;
      background-color: ${color};
    }
    &:hover {
      filter: brightness(120%);
    }
  `
  return (
    <div css={style} onClick={onClick}>
      {children}
    </div>
  )
}
