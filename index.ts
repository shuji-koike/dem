import path from "path";
import express from "express";
import { config } from "dotenv";
import { router } from "./api";

[{}, { path: path.join(__dirname, ".env.defaults") }].forEach(config);

const app = express();
app.use(router);
app.use("/static", express.static(path.join(__dirname, "static")));
app.listen(parseInt(process.env["PORT"]!));
