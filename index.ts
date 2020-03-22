import fs from "fs";
import path from "path";
import express from "express";
import { config } from "dotenv";
import { router } from "./api";

config({
  path: fs.existsSync(path.join(__dirname, ".env"))
    ? undefined
    : path.join(__dirname, ".env.default")
});

const app = express();
app.use(router);
app.use("/static", express.static(path.join(__dirname, "static")));
app.listen(parseInt(process.env["PORT"]!));
