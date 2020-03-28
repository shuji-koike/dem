import axios from "axios";
import React from "react";
import { useLocation } from "react-router-dom";

export const Matches: React.FC = function() {
  const [state, setState] = React.useState<any[]>([]);
  const { pathname } = useLocation();
  const url = "/www.hltv.org" + pathname;
  React.useEffect(() => {
    axios.get(url).then(({ data }) => setState(data));
  }, [url]);
  return (
    <main>
      <ul>
        {state.map(e => (
          <li key={e.href}>{e.title}</li>
        ))}
      </ul>
    </main>
  );
};
