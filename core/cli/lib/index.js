"use strict";

module.exports = core;
const path = require("path");
const semver = require("semver");
const colors = require("colors/safe");
const log = require("@eff-org/log");
const pathExists = require("path-exists").sync;
const userHome = require("user-home");
const commander = require("commander");
const init = require("@eff-org/init");
const exec = require("@eff-org/exec");

const pkg = require("../package.json");
const constant = require("./const");

const program = new commander.Command();

async function core() {
  try {
    await prepare();
    registerCommand();
  } catch (e) {
    log.error(e.message);
  }
}

function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage("<command> [options]")
    .version(pkg.version)
    .option("-d, --debug", "是否开始调试模式", false)
    .option("-tp, --targetPath <targetPath>", "是否指定本地调试文件路径", "");

  program
    .command("init [projectName]")
    .option("-f, --force", "是否强制初始化项目")
    .action(exec);

  // 开启debug模式
  program.on("option:debug", function () {
    if (program.debug) {
      process.env.LOG_LEVEL = "verbose";
    } else {
      process.env.LOG_LEVEL = "info";
    }
    log.level = process.env.LOG_LEVEL;
  });

  // 指定targetPath
  program.on("option:targetPath", function () {
    process.env.CLI_TARGET_PATH = program.targetPath;
  });

  // 对未知命令监听
  program.on("command:*", function (obj) {
    const avaliableCommands = program.commands.map((cmd) => cmd.name());
    console.log(colors.red("未知命令:" + obj[0]));
    if (avaliableCommands.length > 0) {
      console.log(colors.red("可用命令") + avaliableCommands.join(","));
    }
  });

  program.parse(process.argv);

  if (program.args && program.args.length < 1) {
    program.outputHelp();
  }
}

async function prepare() {
  checkPkgVersion();
  checkNodeVersion();
  checkRoot();
  checkUserHome(); //检查用户主目录
  checkEnv(); //检查环境变量
  await checkGlobalUpdate(); //检查是否需要更新
}

async function checkGlobalUpdate() {
  // 1.获取当前版本号和模块名
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // 2.调用npm API，对比哪些版本号是大于当前版本号
  const { getNpmSemverVersion } = require("@eff-org/get-npm-info");
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName);
  // 3.获取最新的版本号，提示用户更新到该版本
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(
      colors.yellow(`请手动更新 ${npmName}，当前版本：${currentVersion}，最新版本：${lastVersion}
                更新命令： npm install -g ${npmName}`)
    );
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
  log.info("version", pkg.version);
}
