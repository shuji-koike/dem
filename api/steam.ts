import axios from "axios"
import express from "express"

export const router = express.Router()

router.use("/api.steampowered.com", async (req, res) => {
  const url =
    "https:/" + req.originalUrl + "&key=" + process.env["STEAM_API_KEY"]
  await axios.get(url).then(({ data }) => res.send(data))
})
