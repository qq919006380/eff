"use strict";

const Package = require("@eff-org/package");
const log=require('npmlog')

function exec() {
  const targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_TARGET_PATH;
  log.verbose("targetPath", targetPath);
  log.verbose("homePath", homePath);

  const pkg = new Package({
    s:"s"
  });
}
module.exports = exec;
