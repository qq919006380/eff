"use strict";
const path = require("path");
const pakDir = require("pkg-dir").sync;
const npminstall = require("npminstall");
const { isObject } = require("@eff-org/utils");
const formatPath = require("@eff-org/format-path");
const { getDefaultRegistry } = require("@eff-org/get-npm-info");
class Package {
  constructor(options) {
    if (!options) {
      throw new Error("Package类的options参数不能为空！");
    }
    if (!isObject(options)) {
      throw new Error("Package类的options参数必须为对象！");
    }
    // package的路径
    this.targetPath = options.targetPath;
    // 缓存package的路径
    this.storeDir = options.storeDir;
    // package的name
    this.packageName = options.packageName;

    // package的version
    this.packageVersion = options.packageVersion;
  }

  //   判断当前Package是否存在
  exists() {}

  // 安装Package
  install() {
    npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [{ name: this.packageName, version: this.packageVersion }],
    });
  }

  // 更新Package
  update() {}

  //   获取入口文件的路径
  getRootFilePath() {
    //   1.获取package.json所在目录 - pkg-dir
    const dir = pakDir(this.targetPath);
    if (dir) {
      //   2.读取package.json require()
      const pkgFile = require(path.resolve(dir, "package.json"));

      //   3.寻找main/lib - path
      if (pkgFile && pkgFile.main) {
        //   4.路径的兼容mac/win
        return formatPath(path.resolve(dir, pkgFile.main));
      }
    }
    return null;
  }
}

module.exports = Package;
