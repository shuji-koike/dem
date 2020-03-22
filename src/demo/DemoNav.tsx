import React from "react";
import { TeamColor } from ".";
import styled from "styled-components";

export const DemoNav: React.FC<{
  match: Match;
  currentRound: number;
  setCurrentRound: (i: number) => void;
}> = function({ match, currentRound, setCurrentRound }) {
  return (
    <StyledTable>
      <tbody>
        <tr>
          {match.Rounds.map((e, i) => (
            <td
              key={e.Frame}
              className={currentRound == i ? "active" : undefined}
              style={{ color: TeamColor[e.Winner] }}
              onClick={() => setCurrentRound(i)}>
              <span>{i + 1}</span>
            </td>
          ))}
        </tr>
      </tbody>
    </StyledTable>
  );
};

const StyledTable = styled.table`
  width: 100%;
  height: 100%;
  background: #222;
  text-align: center;
  table-layout: fixed;
  font-family: monospace;
  cursor: pointer;
  td {
    border-bottom: #0c0c0c 4px solid;
  }
  td:hover {
    font-weight: bold;
    filter: brightness(150%);
  }
  td.active {
    font-weight: bold;
    filter: none;
    background: #333;
    border-bottom-color: #999;
  }
`;
