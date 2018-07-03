#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const program = require('commander');
const newRc = require('../packages/commands/new-rc');
const addConfig = require('../packages/commands/add');
const start = require('../packages/commands/start');
const open = require('../packages/commands/open');

program
  .version('1.0.0', '-v, --version');

program
  .command('new-rc [name]')
  .description('generate a new react component')
  .action(function(name) {
    newRc(name);
  });

program
  .command('add')
  .description('add config for start command')
  .action(function() {
    addConfig();
  });

program
  .command('start')
  .description('start a project')
  .action(function() {
    start();
  });

program
  .command('open')
  .description('open a project')
  .action(function() {
    open();
  });

program.parse(process.argv);