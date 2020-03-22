import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DemoPlayer } from "./DemoPlayer";

export const DemoView: React.FC = function() {
  const path = useParams<any>()[0];
  const [match, setMatch] = React.useState<Match | null>(null);
  React.useEffect(() => {
    axios.get("/api/files/" + path).then(({ data }) => setMatch(data));
  }, [path]);
  if (!match) return <span>loading</span>;
  return <DemoPlayer match={match} />;
};
