import express from "express"

export const router = express.Router()
;(async function () {
  router.use((await import("./files")).router)
  // router.use((await import("./hltv")).router)
  router.use((await import("./steam")).router)
  router.use((await import("./webpack")).router)
})()
