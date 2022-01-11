const fs = require('fs')
const consolidate = require('consolidate')
const genFont = require('./genFont')

const writeFile = (path, file, content) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, {
      recursive: true
    })
  }
  fs.writeFile(`${path}/${file}`, content, {
    flag: 'w'
  }, (err) => {
    if (err) throw err;
  })
}

const renderCss = (options) => {
  consolidate.lodash('template/styles.css', {
    ...options
  }, function (err, content) {
    if (err) throw err;
    const filepath = `${options.fontPath}/style/`
    writeFile(filepath, 'icon.css', content);
  })
}

const renderHtml = (options) => {
  consolidate.lodash('template/example.html', {
    ...options
  }, function (err, content) {
    if (err) throw err;
    const filepath = `${options.fontPath}/`
    writeFile(filepath, 'index.html', content);
  })
}

function webFontsHelper(options) {
  options.startUnicode = options.startUnicode || 0xea01
  options.prependUnicode = !!options.prependUnicode
  options.formats = options.formats || ['svg', 'ttf', 'woff', 'woff2', 'eot']
  options.clone = -1 !== options.formats.indexOf('svg')
  options.timestamp = options.timestamp || Math.round(Date.now() / 1000)
  options.className = options.className || 'icon'
  options.fontPath = options.fontPath || 'font'
  options.fontName = options.fontName || 'icon-font'

  options.callback = function (glyphs) {
    renderCss({
      glyphs,
      fontName: options.fontName,
      fontPath: options.fontPath,
      className: options.className
    })
    renderHtml({
      glyphs,
      fontPath: options.fontPath,
      fontName: options.fontName,
      className: options.className
    })
  }
  genFont(options).then((data) => {
    data.forEach(({
      type,
      result
    }) => {
      writeFile(`${options.fontPath}/`, `${options.fontName}.${type}`, result)
    })
  })
}

export default webFontsHelper
