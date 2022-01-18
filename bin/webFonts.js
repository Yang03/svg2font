#! /usr/bin/env node

const program = require('commander')
const webFontsHelper = require('../src/index')

program
  .version(require('../package').version)
  .usage('[options] <icons ...>')
  .option('--src <type>', 'svg file directory')
  .option('--formats <type>', 'font formats like eot, woff2, woff, ttf', ['eot', 'woff2', 'woff', 'ttf'])
  .option('--fontName <type>', 'the font family name you want [iconfont]')
  .option('--fontPath <type>', 'font family dest]')
  // .option('--svgOptions', 'svgicons2svgfont options')
  .option('--className <type>', 'css class selector name')
  .parse(process.argv)

  const options = program.opts()
  webFontsHelper(options)