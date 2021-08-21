"use strict";

const Command = require("@eff-org/command");
const log = require("@eff-org/log");
class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || "";
    this.force = !!this._cmd.force;
    log.verbose("projectName", this.projectName);
    log.verbose("force", this.force);
  }

  exec() {
    try {
      // 1. 准备阶段
      this.prepare();
      // 2. 下载模板
      // 3.  安装模板
    } catch (e) {
      log.error(e.message);
    }
  }

  prepare() {
    // 判断当前目录是否为空
    const ret = this.isCwdEmpty();
    console.log(ret);
    // 是否启动强制更新
    // 选择创建项目或组件
  }

  isCwdEmpty() {
    const localPath = process.cwd();
    let fileList = fs.readdirSync(localPath);
    // 文件过滤逻辑
    console.log(fileList);
    fileList = fileList.filter((file) => {
      return !file.startsWith(".") && ["node_moduels"].indexOf(file) < 0;
    });
    console.log(fileList);
    return !fileList || fileList.length <= 0;
  }
}
function init(argv) {
  //   console.log("init", projectName, cmdObj.force);
  return new InitCommand(argv);
}
module.exports = init;
module.exports.InitCommand = InitCommand;
