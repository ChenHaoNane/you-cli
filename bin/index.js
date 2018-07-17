#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const program = require('commander');
const newRc = require('../packages/commands/new-rc');
const addConfig = require('../packages/commands/add');
const start = require('../packages/commands/start');
const open = require('../packages/commands/open');
const tag = require('../packages/commands/tag');

program
  .version('1.0.0', '-v, --version');

program
  .command('new-rc [name]')
  .description('根据模板生成一个react组件')
  .action(function(name) {
    newRc(name);
  });

program
  .command('add')
  .description('添加项目配置')
  .action(function() {
    addConfig();
  });

program
  .command('start')
  .description('在已添加的项目中选择一个项目启动')
  .action(function() {
    start();
  });

program
  .command('open')
  .description('在已添加的项目中选择一个项目打开')
  .action(function() {
    open();
  });

program
  .command('tag')
  .description('为当前项目打一个最新的用于提测的tag')
  .action(function() {
    tag();
  });

program.parse(process.argv);