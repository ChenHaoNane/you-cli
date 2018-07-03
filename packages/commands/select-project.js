const chalk = require('chalk');
const inquirer = require('inquirer');
const config = require('./config');

module.exports = function(action) {
  const configData = config.get();
  const projects = (configData && configData.projects) || {};
  const keys = Object.keys(projects);
  if (keys.length === 0) {
    console.log(chalk.yellow('未获取到项目配置信息, 请先通过 you add 添加配置'));
    return;
  }
  return inquirer.prompt({
    name: 'projectName',
    message: `请选择需要${action}的项目名称: `,
    type: 'list',
    choices: keys,
    default: 0,
  });
};