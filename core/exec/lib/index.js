"use strict";

const Package = require("@eff-org/package");
const log = require("@eff-org/log");
const SETTINGS = {
  init: "jquery",
};
const CACHE_DIR = "dependencies/";
const path = require("path");
async function exec() {
  let targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  let storeDir = "";
  log.verbose("targetPath", targetPath);
  log.verbose("homePath", homePath);

  const cmdObj = arguments[arguments.length - 1];
  const cmdName = cmdObj.name();
  const packageName = SETTINGS[cmdName];
  const packageVersion = "latest";
  let pkg;
  if (!targetPath) {
    targetPath = path.resolve(homePath, CACHE_DIR); // 生成缓存路径
    storeDir = path.resolve(targetPath, "node_modules");
    log.verbose("targetPath", targetPath);
    log.verbose("storeDir", storeDir);
    pkg = new Package({
      targetPath,
      storeDir,
      packageName,
      packageVersion,
    });
    if (await pkg.exists()) {
      // 更新package
      await pkg.update();
    } else {
      // 安装package
      await pkg.install();
    }
  } else {
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion,
    });
    const rootFile = pkg.getRootFilePath();
    console.log("rootFile", rootFile);
    if (rootFile) {
      try {
        // 在当前进程中调用
        require(rootFile).call(null, Array.from(arguments));
        // 在node子进程中调用
      } catch (e) {
        log.error(e.message);
      }
    }
  }
}
module.exports = exec;
