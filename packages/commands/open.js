const chalk = require('chalk');
const co = require('co');
const { spawn } = require('child_process');
const config = require('./config');
const selectProject = require('./select-project');

module.exports = function() {
  co(function*() {
    try {
      const answers = yield selectProject('打开');
      const projectName = answers.projectName;
      const configData = config.get();
      const { path } = configData.projects[projectName];
      spawn(`code ${path}`, {
        shell: true,
      });
      console.log(chalk.green(`${projectName}打开成功`));
    } catch (error) {
      console.log(chalk.red(error));
    }
  });
};