const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const inquirer = require('inquirer');
const config = require('./config');

module.exports = function() {
  inquirer.prompt([
    {
      name: 'projectName',
      message: '请输入项目名: ',
      type: 'input',
      validate: function(value) {
        if (value) {
          return true;
        }
        return '项目名不能为空';
      },
    },
    {
      name: 'projectPath',
      message: '请输入项目路径: ',
      type: 'input',
      validate: function(value) {
        if (value) {
          return true;
        }
        return '项目路径不能为空';
      },
    },
    {
      name: 'cli',
      message: '请输入启动脚本命令(默认: npm start): ',
      type: 'input',
      default: 'npm start',
    },
    {
      name: 'port',
      message: '请输入端口号: ',
      type: 'input',
      default: 3000,
      validate: function(value) {
        if (Number(value) > 0) {
          return true;
        }
        return '端口号必须为 int 类型!';
      },
    },
  ])
    .then((answers) => {
      const { projectName, projectPath, cli } = answers;
      const port = Number(answers.port);
      const cwd = process.cwd();
      const absolutePath = path.resolve(cwd, projectPath);
      const pkgPath = path.resolve(absolutePath, 'package.json');
      if (!fs.existsSync(pkgPath)) {
        console.log(chalk.red(`在${absolutePath}中未找到package.json文件!`));
        return;
      }
      const configData = config.get();
      configData.projects = configData.projects || {};
      configData.projects[projectName] = {
        path: absolutePath,
        cli,
        port,
      };
      config.set(configData);
    });
};