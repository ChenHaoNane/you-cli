const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const { HOME } = process.env;
const configPath = path.resolve(HOME, '.you-cli-config.json');

module.exports = {
  get() {
    if (!fs.existsSync(configPath)) {
      this.set({});
      return {};
    }
    return JSON.parse(fs.readFileSync(configPath));
  },

  set(data = {}) {
    fs.writeFileSync(configPath, JSON.stringify(data));
    console.log(chalk.green(`配置文件已更新: ${configPath}`));
  },
};