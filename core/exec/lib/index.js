"use strict";

const Package = require("@eff-org/package");
const log = require("@eff-org/log");
const SETTINGS = {
  init: "@imooc-cli-dev/init",
};
const CACHE_DIR = "dependencies/";
const path = require("path");
function exec() {
  let targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  let storeDir = "";
  log.verbose("targetPath", targetPath);
  log.verbose("homePath", homePath);

  const cmdObj = arguments[arguments.length - 1];
  const cmdName = cmdObj.name();
  const packageName = SETTINGS[cmdName];
  const packageVersion = "latest";
  if (!targetPath) {
    targetPath = path.resolve(homePath, CACHE_DIR); // 生成缓存路径
    storeDir = path.resolve(targetPath, "node_modules");
    log.verbose("targetPath", targetPath);
    log.verbose("storeDir", storeDir);
  }
  const pkg = new Package({
    targetPath,
    packageName,
    packageVersion,
    storeDir,
  });
  console.log(11,pkg.getRootFilePath());
}
module.exports = exec;
