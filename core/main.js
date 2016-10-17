const debug = require('debug')('main')
const pdfkit = require('pdfkit')
const data = require('./data')
const fs = require('fs')

const inchesToPoints = inches => inches * 72;

const renderItem = (item, doc) => {
  doc.fontSize(14)
  doc.text(item.name, { align: 'center' })

  doc.fontSize(8)
  doc.moveDown()
  let attuenment = ''

  if (item.attunment) {
    attuenment = `Requires attunment`
    if (item.attunment.requiredBy) {
      attunment = `${attunment} by a ${item.attunment.requiredBy}`;
    }
  }

  let useableBy = item.useableBy ? `Useable by ${item.useableBy}` : ''

  let details = `${item.type}, ${item.rarity} - (${item.cost}) ${attuenment} ${useableBy}`;
  doc.text(details, { align: 'left' })

  doc.moveDown()
  doc.text(item.description, { align: 'left' })

  if(item.charges) {
    doc.moveDown()
    doc.text("Charges Used:", { align: 'center' })
    doc.moveDown()

    let size = inchesToPoints(.25) 
    let margin = inchesToPoints(.125)

    for(var i = 0; i < +item.charges; i++) {
      // current x + number of squares + margins
      let x = doc.x + i * (size + margin)
      let y = doc.y
      doc.rect(x, y, size, size).stroke()
    }

    doc.moveTo(doc.x, doc.y + size + margin)
  }
}

const checkFilePermissions = fileName => {
  return new Promise((resolve, reject) => {
    fs.access(fileName, fs.W_OK, err => {
      if (err && err.code !== 'ENOENT') {
        reject(err)
        return
      }

      resolve()
    })
  })
}

const generatePdf = (items, opts) => {
  return new Promise((resolve, reject) => {
    if(!items || items.length === 0) {
      reject('No items passed to generate') 
    }

    opts = Object.assign({}, opts, {
      fileName: 'items.pdf'
    })

    checkFilePermissions(opts.fileName).then(_ => {
      let doc = new pdfkit({ margin: inchesToPoints(1) }) 

      doc.pipe(fs.createWriteStream(opts.fileName))
      doc.font('Asimov.otf')

      debug(`starting render ${items[0]}`)

      let itemPromises = items.map(item => getItem(item))

      console.log(itemPromises.length)
      Promise.all(itemPromises).then(values => {
        debug('completed all')

        values.forEach(value => {
          debug('rendering items')
          renderItem(value, doc) 
        })

        doc.end()
        resolve(opts.fileName)
      })
    }).catch(reject)
  })
}

const getItem = item => {
  return new Promise((resolve, reject) => {
    data.findItem(item.name)
      .then(items => {
        debug(`Found item ${item.name}`)
        resolve(items[0])
      })
      .catch(err => {
        debug(`Could not find item with name ${item.name}`)
        resolve(null)
      })
  })
}

module.exports = {
  generatePdf
}
