import express from "express";
import axios from "axios";

export const router = express.Router();

const token = process.env["STEAM_API_KEY"];

router.use("/api.steampowered.com", async (req, res) => {
  const url = "https:/" + req.originalUrl + "&key=" + token;
  axios.get(url).then(({ data }) => res.send(data));
});
