const chalk = require('chalk');
const co = require('co');
const moment = require('moment');
const { spawnSync } = require('child_process');

function getTagSuffix(tagString) {
  let suffix = '_a';
  if (!tagString || !tagString.length) {
    return suffix;
  }
  const tags = tagString.split('\n')
    .filter(((tag) => {
      return tag && tag.trim() !== '';
    }))
    .sort();
  const lastTag = tags.pop();
  const letter = lastTag.slice(-1);
  suffix = '_' + String.fromCharCode(letter.charCodeAt() + 1);
  return suffix;
}

module.exports = function() {
  co(function* () {
    try {
      const date = moment().format('YYYYMMDD');
      const { stdout, stderr } = spawnSync(`git tag -l ${date}*`, {
        shell: true,
      });
      const tags = stdout.toString();
      const suffix = getTagSuffix(tags);
      const newTag = `${date}${suffix}`;
      spawnSync(`git tag ${newTag}`, {
        shell: true,
      });
      spawnSync(`git push origin ${newTag}`, {
        shell: true,
      });
      console.log(chalk.green(`tag推送成功, 当前最新tag为${chalk.yellow(newTag)}`));
    } catch (error) {
      console.log(chalk.red(error));
    }
  });
};