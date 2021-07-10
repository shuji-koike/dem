import * as functions from "firebase-functions"

export const helloWorld = functions
  .region("asia-northeast1")
  .https.onRequest((req, res) => {
    functions.logger.debug(req.headers)
    functions.logger.info("Hello logs!", { structuredData: true })
    functions.logger.error("error!!!")
    res.send("Hello from Firebase!")
  })
