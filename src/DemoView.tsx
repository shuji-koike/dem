import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { DemoPlayer } from "./demo/DemoPlayer";

export const DemoView: React.FC = function() {
  const path = useParams<any>()[0];
  const [match, setMatch] = React.useState<Match | null>(null);
  React.useEffect(() => {
    axios.get("/api/files/" + path).then(({ data }) => setMatch(data));
  }, [path]);
  if (!match) return <span>loading</span>;
  return <DemoPlayer match={match} />;
};
