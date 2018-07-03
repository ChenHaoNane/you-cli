#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const program = require('commander');
const newRc = require('../packages/commands/new-rc');

program
  .version('1.0.0', '-v, --version');

program
  .command('new-rc [name]')
  .description('generate a new react component')
  .action(function(name) {
    newRc(name);
  });

program.parse(process.argv);