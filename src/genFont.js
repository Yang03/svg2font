const svg2ttf = require('svg2ttf')
const ttf2woff = require('ttf2woff')
const ttf2woff2 = require('ttf2woff2')
const ttf2eot = require('ttf2eot')
const glob = require('glob')
const path = require('path')
const SVGIcon2SVGFontStream = require('svgicons2svgfont')
const SVGIconsDirStream = require('svgicons2svgfont/src/iconsdir')

const generators = {
  svg: {
    fn: (options, content) => {
      return new Promise((resolve, reject) => {
        const globs = glob.sync(options.src)

        const fontStream = new SVGIconsDirStream(
          [].concat.apply([], globs.map(g => glob.sync(g))),
          options,
        ).pipe(new SVGIcon2SVGFontStream(options))

        let fontBuffer = Buffer.alloc(0)
        fontStream
        .on('data', (data) => {
          fontBuffer = Buffer.concat([fontBuffer, data])
        })
        .on('end', () => {
          return resolve(fontBuffer.toString())
        })
      })
    }
  },
  ttf: {
    deps: ['svg'],
    fn: (options, content ) => {
      return new Promise((resolve, reject) => {
        let font = svg2ttf(content)
        font = Buffer.alloc(font.buffer.length, font.buffer)
        return resolve(font)
      })
    }
  },
  woff: {
    deps: ['ttf'],
    fn: (options, ttfFont) => {
      return new Promise((resolve, reject) => {
        let font = ttf2woff(new Uint8Array(ttfFont))
        font = Buffer.alloc(font.length, font)
        return resolve(font)
      })
    }
  },
  woff2: {
		deps: ['ttf'],
		fn: (options, ttfFont) => {
      return new Promise((resolve, reject) => {
        let font = ttf2woff2(new Uint8Array(ttfFont))
        font = Buffer.alloc(font.length, font)
        return resolve(font)
      })
		}
	},

	eot: {
		deps: ['ttf'],
    fn: (options, ttfFont) => {
      return new Promise((resolve, reject) => {
        let font = ttf2eot(new Uint8Array(ttfFont))
        font = Buffer.alloc(font.length, font)
        return resolve(font)
      })
		}
	}
}

const genFont = (options) => {
  const genTasks = {}
  const makeGenTask = (options, type) => {
    
    if (genTasks[type]) return genTasks[type]
    const gen = generators[type]
    const depsTasks = gen?.deps?.map((item) => {
      return makeGenTask(options, item)
    }) || []
  
    const task = Promise.all(depsTasks).then((depsFonts) =>{
      const args = [options].concat(depsFonts)
			return gen?.fn?.apply(null, args)
    })
    genTasks[type] = task
    return task
  }
  for (let i = 0; i < options.formats.length; i++) {
		const type = options.formats[i]
		makeGenTask(options, type)
	}
  const task = Object.values(genTasks)
  return Promise.all(task).then((result) => {
    // console.log(result)
    const data = [];
    Object.keys(genTasks).forEach((key, i) => {
      data.push({
        type: key,
        result: result[i]
      })
    })
    return data
  })
}

module.exports = genFont