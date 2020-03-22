import child_process from "child_process";
import fs from "fs";
import util from "util";
import express from "express";
import readdir from "recursive-readdir";

const exec = util.promisify(child_process.execFile);

export const router = express.Router();

router.get("/api/files", async (req, res) => {
  res.send(
    (await readdir(process.env["APP_DEMO_DIR"]!))
      .map(e => e.replace(process.env["APP_DEMO_DIR"]!, "").slice(1))
      .filter(e => !/^[.~]/.test(e))
      .filter(e => /\.(dem|dem\.gz|rar)$/.test(e))
  );
});
router.use("/api/files", async (req, res, next) => {
  const filePath =
    process.env["APP_DEMO_DIR"] + req.path.replace("/api/files/", ""); //FIXME
  if (req.url.endsWith(".json")) {
    require("connect-gzip-static")(process.env["APP_DEMO_DIR"])(req, res, next); //FIXME
  } else if (req.url.endsWith(".dem")) {
    if (fs.existsSync(filePath)) {
      if (!fs.existsSync(filePath.replace(/\.dem$/, ".dem.json.gz"))) {
        await exec("go", ["run", ".", filePath]);
      }
    }
    res.redirect(req.originalUrl.replace(/\.dem$/, ".dem.json"));
  } else if (req.url.endsWith(".rar")) {
    const ret = await exec("unrar", ["lb", filePath]);
    res.send(ret.stdout.split("\n").slice(0, -1));
  } else {
    console.error(req.path, filePath);
    res.status(500);
  }
});
