const chalk = require('chalk');
const inquirer = require('inquirer');
const getPort = require('get-port');
const { kill } = require('cross-port-killer');
const co = require('co');
const { spawn } = require('child_process');
const config = require('./config');
const selectProject = require('./select-project');

module.exports = function() {
  co(function*() {
    try {
      const answers = yield selectProject('启动');
      const projectName = answers.projectName;
      const configData = config.get();
      const { path, port, cli } = configData.projects[projectName];
      const newPort = yield getPort({ port });

      if (newPort !== port) {
        const { isNeedKill } = yield inquirer.prompt({
          name: 'isNeedKill',
          message: `当前端口: ${port}已被占用, 是否解除占用?`,
          type: 'confirm',
        });
        if (isNeedKill) {
          yield kill(port);
          console.log(chalk.green(`端口${port}已解除占用`));
        } else {
          console.log(chalk.yellow('已终止启动'));
        }
      }

      console.log('开始运行项目', path, cli);

      const start = spawn(`cd ${path} && ${cli}`, {
        shell: true,
      });

      start.stdout.on('data', function(data) {
        console.log(data.toString());
      });

      start.stderr.on('data', function(data) {
        console.log('stderr: ' + data.toString());
      });
      
      start.on('exit', function(code) {
        console.log('child process exited with code ' + code.toString());
      });
    } catch (error) {
      console.log(chalk.red(error));
    }
  });
};