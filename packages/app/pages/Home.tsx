import React from "react"

import { HeaderSlot } from "../components/layout"
import { DemoList } from "./DemoList"
import { Sandbox } from "./Sandbox"

export const Home: React.VFC = () => {
  return (
    <>
      <HeaderSlot>
        <h1>Home</h1>
      </HeaderSlot>
      <Sandbox />
      <DemoList />
    </>
  )
}
