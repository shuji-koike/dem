import axios from "axios"
import * as functions from "firebase-functions"

const { logger } = functions

// eslint-disable-next-line
const config: () => { key: { steam: string } } = () => functions.config() as any

export const helloWorld = functions
  .region("asia-northeast1")
  .https.onRequest((req, res) => {
    logger.debug(req.headers)
    logger.info("Hello logs!", { structuredData: true })
    logger.error("error!!!")
    res.send("Hello from Firebase!")
  })

export const getPlayerSummaries = functions
  .region("asia-northeast1")
  .https.onCall(async ({ steamids }) => {
    logger.debug(steamids)
    const { data } = await axios.get(
      "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/",
      {
        params: { steamids, key: config().key.steam },
      }
    )
    logger.debug(data)
    return data
  })
