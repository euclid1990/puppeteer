const spawn = require('cross-spawn')
const bin = '/usr/local/bin/gm'

/**
 * Compare two images uses graphicsmagicks `compare` command.
 *
 * @param {String} original Path to an image.
 * @param {String} compareTo Path to another image to compare to `original`.
 * @param {Number|Object} [options] Options object or the amount of difference to tolerate before failing - defaults to 0.4
 */
module.exports.compare = async function (original, compareTo, options) {
  const args = ['compare', '-metric', 'mse', original, compareTo]
  let tolerance = 0.4
  // Outputting the diff image
  if (typeof options === 'object') {
    if (options.file) {
      if (typeof options.file !== 'string') {
        throw new TypeError('The path for the diff output is invalid')
      }
      // Graphicsmagick defaults highlight color is red
      if (options.highlightColor) {
        args.push('-highlight-color')
        args.push(options.highlightColor)
      }
      // Specifies the pixel difference annotation style: Assign, Threshold, Tint, or XOR
      if (options.highlightStyle) {
        args.push('-highlight-style')
        args.push(options.highlightStyle)
      }
      args.push('-file')
      args.push(options.file)
    }

    if (typeof options.tolerance !== 'undefined') {
      if (typeof options.tolerance !== 'number') {
        throw new TypeError('The tolerance value should be a number')
      }
      tolerance = options.tolerance
    }
  } else {
    if (typeof options === 'function') {
      cb = options // tolerance value not provided, flip the cb place
    } else {
      tolerance = options
    }
  }

  const proc = spawn(bin, args)
  let stdout = ''
  let stderr = ''
  proc.stdout.on('data', function (data) { stdout += data })
  proc.stderr.on('data', function (data) { stderr += data })
  return await new Promise((resolve, reject) => {
    proc.on('close', function (code) {
      if (code !== 0) {
        return reject(stderr)
      }
      // Since ImageMagick similar gives err code 0 and no stdout, there's really no matching
      // Otherwise, output format for IM is `12.00 (0.123)` and for GM it's `Total: 0.123`
      const regex = /Total: (\d+\.?\d*)/m
      const match = regex.exec(stdout)
      if (!match) {
        const err = new Error('Unable to parse output.\nGot ' + stdout)
        return reject(err)
      }
      const equality = parseFloat(match[1])
      resolve({ err: null, isEqual: equality <= tolerance, equality, stdout, original, compareTo })
    })
  })
}

/**
 * Create GIF animation form a set of images uses graphicsmagicks `convert` command.
 *
 * @param {Array} img Path to an image.
 * @param {String} out Path to output image.
 * @param {Boolean} delay Display the next image after pausing (1/100s)
 */
module.exports.animate = async function (imgs, out, delay = 50) {
  const args = ['convert', '-delay', delay, ...imgs, out]

  const proc = spawn(bin, args)
  let stdout = ''
  let stderr = ''
  proc.stdout.on('data', function (data) { stdout += data })
  proc.stderr.on('data', function (data) { stderr += data })
  return await new Promise((resolve, reject) => {
    proc.on('close', function (code) {
      if (code !== 0) {
        return reject(stderr)
      }
      resolve(true)
    })
  })
}

/**
 * Append a set of images uses graphicsmagicks `convert` command.
 *
 * @param {Array} img Path to an image.
 * @param {String} out Path to output image.
 * @param {Boolean} ltr Stack images left-to-right or top-to-bottom
 */
module.exports.append = async function (imgs, out, ltr = true) {
  const args = [...imgs, out]
  const appendOption = ltr ? '+append' : '-append'
  args.unshift('convert', appendOption)

  const proc = spawn(bin, args)
  let stdout = ''
  let stderr = ''
  proc.stdout.on('data', function (data) { stdout += data })
  proc.stderr.on('data', function (data) { stderr += data })
  return await new Promise((resolve, reject) => {
    proc.on('close', function (code) {
      if (code !== 0) {
        return reject(stderr)
      }
      resolve(true)
    })
  })
}
