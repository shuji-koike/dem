import React from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const Matches: React.FC = function() {
  const [state, setState] = React.useState<any[]>([]);
  const url = "/www.hltv.org" + useLocation().pathname;
  React.useEffect(() => {
    axios.get(url).then(({ data }) => setState(data));
  }, [url]);
  return (
    <ul>
      {state.map(e => (
        <li key={e.href}>{e.title}</li>
      ))}
    </ul>
  );
};
