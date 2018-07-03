const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const template = require('lodash/template');

let templatePath;
let targetRootPath;

// 获取组件名, 去掉- _, 首字母转大写
function getComponentName(name) {
  name = name
    .replace(/[-_]/g, '')
    .replace(/[a-z]/, ($1) => {
      return $1.toUpperCase();
    });
  return name;
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file) {
      var currentPath = `${path}/${file}`;
      if (fs.lstatSync(currentPath).isDirectory()) {
        deleteFolderRecursive(currentPath);
      } else {
        fs.unlinkSync(currentPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function copyTemplate(name) {
  function readAndCopyFile(parentPath, templatePath) {
    const files = fs.readdirSync(parentPath);

    files.forEach((file) => {
      const currentPath = `${parentPath}/${file}`;
      const stat = fs.statSync(currentPath);
      const filePath = `${targetRootPath}/${templatePath}/${file}`;

      if (stat.isDirectory()) {
        fs.mkdirSync(filePath);
        readAndCopyFile(`${parentPath}/${file}`, `${templatePath}/${file}`);
      } else {
        let content = fs.readFileSync(currentPath, 'utf8');
        const componentName = getComponentName(name);
        content = template(content)({
          name: componentName,
        });
        fs.writeFileSync(filePath, content, 'utf8');
      }
    });
  }

  readAndCopyFile(templatePath, name);
}

function generateRc(name) {
  if (!name) {
    console.log(chalk.red('The name field is required!'));
    return;
  }
  templatePath = path.join(__dirname, '..', 'template/react-component');
  targetRootPath = process.cwd();
  const targetDir = path.join(targetRootPath, name);
  if (fs.existsSync(targetDir)) {
    inquirer.prompt([
      {
        name: 'component-overwrite',
        type: 'confirm',
        message: `Component named ${name} is already existed, are you sure to overwrite?`,
        validate: function(input) {
          if (input.lowerCase !== 'y' && input.lowerCase !== 'n') {
            return 'Please input y/n';
          } else {
            return true;
          }
        },
      },
    ])
      .then((answers) => {
        if (answers['component-overwrite']) {
          deleteFolderRecursive(targetDir);
          console.log(chalk.yellow(`Component already existed, removing!`));

          fs.mkdirSync(targetDir);
          copyTemplate(name);
          console.log(chalk.green(`Generate new react component "${name}" finished!`));
        }
      })
      .catch((error) => {
        console.log(chalk.red(error));
      });
  } else {
    fs.mkdirSync(targetDir);
    copyTemplate(name);
    console.log(chalk.green(`Generate new react component "${name}" finished!`));
  }
}

module.exports = generateRc;