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
}
function init(argv) {
  //   console.log("init", projectName, cmdObj.force);
  return new InitCommand(argv);
}
module.exports = init;
module.exports.InitCommand = InitCommand;
