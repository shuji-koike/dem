import axios from "axios"
import { config, logger, region } from "firebase-functions"

export const getPlayerSummaries = region("asia-northeast1").https.onCall(
  async ({ steamids }) => {
    const { data } = await axios.get(
      "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/",
      {
        params: { steamids, key: config()["key"].steam },
      }
    )
    logger.debug({ steamids, data })
    return data.response
  }
)
