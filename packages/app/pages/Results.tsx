import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import React from "react"
import { Link, useLocation } from "react-router-dom"

import { HeaderSlot } from "../components/layout"

export const Results: React.VFC = () => {
  const [state, setState] = React.useState<{ href: string; text: string }[]>([])
  const { pathname, search } = useLocation()
  const url = `/www.hltv.org${pathname}${search}`
  React.useEffect(() => {
    axios.get(url).then(({ data }) => setState(data))
  }, [url])
  return (
    <main>
      <HeaderSlot>
        <h1>Results</h1>
      </HeaderSlot>
      <ul>
        {state.map((e) => (
          <li key={e.href}>
            <a href={e.href} rel="noopener noreferrer">
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
            <Link to={e.href.replace("https://www.hltv.org", "")}>
              {e.text}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
