"use strict";
const fs = require("fs");
const inquirer = require("inquirer");
const fse = require("fs-extra");
const Command = require("@eff-org/command");
const log = require("@eff-org/log");

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || "";
    this.force = !!this._cmd.force;
    log.verbose("projectName", this.projectName);
    log.verbose("force", this.force);
  }

  async exec() {
    try {
      // 1. 准备阶段
      await this.prepare();
      // 2. 下载模板
      // 3.  安装模板
    } catch (e) {
      log.error(e.message);
    }
  }

  async prepare() {
    // 判断当前目录是否为空
    const localPath = process.cwd();
    if (!this.isDirEmpty(localPath)) {
      //  询问是否继续创建
      const { ifContinue } = await inquirer.prompt({
        type: "confirm",
        name: "ifContinue",
        default: false,
        message: "当文件夹不为空，是否继续创建？",
      });
      if (ifContinue) {
        fse.emptydirSync()
        console.log('清空成功');
      }
    }
    // 是否启动强制更新
    // 选择创建项目或组件
  }

  isDirEmpty(localPath) {
    let fileList = fs.readdirSync(localPath);
    // 文件过滤逻辑
    fileList = fileList.filter((file) => {
      return !file.startsWith(".") && ["node_moduels"].indexOf(file) < 0;
    });
    return !fileList || fileList.length <= 0;
  }
}
function init(argv) {
  //   console.log("init", projectName, cmdObj.force);
  return new InitCommand(argv);
}
module.exports = init;
module.exports.InitCommand = InitCommand;
