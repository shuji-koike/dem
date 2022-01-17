import axios from "axios"
import { config, logger, region } from "firebase-functions"

const { https } = region("asia-northeast1")

export const getPlayerSummaries = https.onCall(async ({ steamids }) => {
  const { data } = await axios.get(
    "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/",
    { params: { steamids, key: config()["key"].steam } }
  )
  logger.debug({ steamids, data })
  return data.response
})
