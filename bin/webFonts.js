#! /usr/bin/env node

const program = require('commander')
const svg2Font = require('../src/index')

program
  .version(require('../package').version)
  .usage('[options] <icons ...>')
  .option('--src', 'svg file directory')
  .option('--formats', 'font formats like eot, woff2, woff, ttf', ['eot', 'woff2', 'woff', 'ttf'])
  .option('--fontName', 'the font family name you want [iconfont]')
  .option('--fontPath', 'font family dest]')
  // .option('--svgOptions', 'svgicons2svgfont options')
  .option('--className', 'css class selector name')
  .parse(process.argv)

svg2Font(program)