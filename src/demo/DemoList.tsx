import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

export const DemoList: React.FC = function() {
  const [state, setState] = React.useState([]);
  React.useEffect(() => {
    axios.get("/api/files").then(({ data }) => setState(data));
  }, []);
  return (
    <ul>
      {state.map(e => (
        <li key={e}>
          <Link to={`/dem/${e}`}>{e}</Link>
        </li>
      ))}
    </ul>
  );
};
