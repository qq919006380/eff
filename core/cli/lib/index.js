"use strict";

module.exports = core;
const path = require("path");
const semver = require("semver");
const colors = require("colors/safe");
const log = require("@eff-org/log");
const pathExists = require("path-exists").sync;
const userHome = require("user-home");

const pkg = require("../package.json");
const constant = require("./const");


let args, config;

function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkInputArgs();
    checkEnv();
  } catch (e) {
    log.error(e.message);
  }
}
function checkEnv() {
  const dotenv = require("dotenv");
  const dotenvPath = path.resolve(userHome, ".env");
  if (pathExists(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    });
  } 
  createDefaultConfig();
  log.verbose("环境变量", process.env.CLI_HOME_PATH);
}
function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig["cliHome"] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig["cliHome"] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

function checkInputArgs() {
  const minimist = require("minimist");
  args = minimist(process.argv.slice(2));
  checkArgs();
}
function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = "verbose";
  } else {
    process.env.LOG_LEVEL = "info";
  }
  log.level = process.env.LOG_LEVEL;
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red("当前登录用户主目录不存在！"));
  }
}
function checkRoot() {
  const rootCheck = require("root-check");
  rootCheck();
}
function checkNodeVersion() {
  // 检查当前版本号
  const currentVersion = process.version;

  // 比对最低版本号
  const lowesVersion = constant.LOWEST_NODE_VERSION;
  if (!semver.gte(currentVersion, lowesVersion)) {
    throw new Error(colors.red(`eff-org需要安装${lowesVersion}以上版本`));
  }
}
function checkPkgVersion() {
  log.notice("version", pkg.version);
}
