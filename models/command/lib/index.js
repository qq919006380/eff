"use strict";
const log = require("@eff-org/log");
const semver = require("semver");
const colors = require("colors/safe");

const LOWEST_NODE_VERSION = "8.0.0";
class Command {
  constructor(argv) {
    this._argv = argv;
    if (!argv) {
      throw new Error("参数不能为空");
    }
    if (!Array.isArray(argv)) {
      throw new Error("参数必须为数组！");
    }
    if (argv.length < 1) {
      throw new Error("参数列表为空");
    }
    let runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.checkNodeVersion());
      chain = chain.then(() => this.initArgs());
      chain = chain.then(() => this.init());
      chain = chain.then(() => this.exec());
      chain.catch((err) => {
        log.error(err.message);
      });
    });
  }

  initArgs() {
    this._cmd = this._argv[this._argv.length - 1];
    this._argv = this._argv.slice(0, this._argv.length - 1);
  }

  checkNodeVersion() {
    // 检查当前版本号
    const currentVersion = process.version;

    // 比对最低版本号
    const lowesVersion = LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion, lowesVersion)) {
      throw new Error(colors.red(`eff-org需要安装${lowesVersion}以上版本`));
    }
  }
  init() {
    throw new Error("init必须实现");
  }

  exec() {
    throw new Error("exec必须实现");
  }
}
module.exports = Command;
