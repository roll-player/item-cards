const pdfkit = require('pdfkit')
const items = require('./items.json')
const scrolls = require('./scrolls.json')
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

let allItems = [].concat(items, scrolls)
const itemsIndex = allItems.reduce((initial, item) => { initial[item.name] = item; return initial }, {})

const checkFilePermissions = fileName => {
  return new Promise((resolve, reject) => {
    fs.access(fileName, fs.W_OK, err => {
      if (err && err.code !== 'ENOENT') {
        console.log(err)
        reject(err)
        return
      }

      console.log('no error')
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

      items.forEach(item => {
        let itemObj = itemsIndex[item.name]

        if (!itemObj) {
          console.error(`Could not find item with name ${item.name}`) 
          return
        }

        for(let i = 0; i < item.count; i++) {
          renderItem(itemObj, doc)
          doc.moveDown(4)
        }

      })

      doc.end()
    }).catch(reject)
  })
}

module.exports = {
  generatePdf
}
