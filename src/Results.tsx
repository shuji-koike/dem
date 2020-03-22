import React from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

export const Results: React.FC = function() {
  const [state, setState] = React.useState<any[]>([]);
  const url = "/www.hltv.org" + useLocation().pathname + useLocation().search;
  React.useEffect(() => {
    axios.get(url).then(({ data }) => setState(data));
  }, [url]);
  return (
    <ul>
      {state.map(e => (
        <li key={e.href}>
          <a href={e.href}>
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
          <Link to={e.href.replace("https://www.hltv.org", "")}>{e.text}</Link>
        </li>
      ))}
    </ul>
  );
};
