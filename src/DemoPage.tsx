import axios from "axios";
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { DemoPlayer } from "./demo/DemoPlayer";

export const DemoPage: React.FC = function() {
  const path = useParams<{ 0: string }>()[0];
  const { search } = useLocation();
  const [match, setMatch] = React.useState<Match | null>(null);
  const [tab, setTab] = React.useState("main");
  React.useEffect(() => {
    axios.get(`/api/files/${path}${search}`).then(({ data }) => setMatch(data));
  }, [path]);
  if (!match) return <span>loading</span>;
  switch (tab) {
    case "demo":
      return <DemoPlayer match={match} />;
    default:
      return (
        <main>
          <DebugView match={match}></DebugView>
        </main>
      );
  }
};

const DebugView: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <>
      <pre>
        {JSON.stringify({
          ...match,
          Rounds: undefined,
          KillEvents: undefined,
          NadeEvents: undefined
        })}
      </pre>
      {match.Rounds?.map((e, i) => (
        <pre key={`round-${i}`}>
          {JSON.stringify({
            ...e,
            Frames: undefined,
            length: e.Frames.length
          })}
        </pre>
      ))}
      {match.KillEvents?.map((e, i) => (
        <pre key={`kill-${i}`}>{JSON.stringify(e)}</pre>
      ))}
      {match.NadeEvents?.map((e, i) => (
        <pre key={`nade-${i}`}>{JSON.stringify(e)}</pre>
      ))}
    </>
  );
};
