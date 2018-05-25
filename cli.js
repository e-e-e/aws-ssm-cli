#!/usr/bin/env node

var program = require('commander')
var commands = require('./commands')

program
  .command('export <file>')
  .option('-r, --region <region>', 'Set the region')
  .option('-p, --profile <profile>', 'Which AWS profile to use')
  .option('-n, --prefix <prefix>', 'Export only keys matching prefix')
  .action(function (file, cmd) {
    commands.export(file, cmd)
  })

program
  .command('import <file>')
  .option('-r, --region <region>', 'Set the region')
  .option('-p, --profile <profile>', 'Which AWS profile to use')
  .option('-k, --encryptionKeyId <key>', 'A key to sign secure string parameters')
  // .option('-n, --prefix <prefix>', 'Import only keys matching prefix')
  .action(function (file, cmd) {
    commands.import(file, cmd)
  })

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

program.parse(process.argv)
