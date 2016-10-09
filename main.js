const program = require('commander')
const pdfkit = require('pdfkit')
const package = require('./package.json')
const items = require('./items.json')
const scrolls = require('./scrolls.json')

const fs = require('fs')

const nameRegex = /(.+?)(\[(\d)\]|)$/ 
const names = value =>  { 
  const names = value.split(',').map(name => name.trim())

  return names.map(name => {
    console.log(name)
    let matches = nameRegex.exec(name)
    console.log(matches)
    let itemName = matches[1].trim()
    let count = matches[3] || 1

    return {
      name: itemName,
      count
    }
  })
}

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

const inchesToPoints = inches => inches * 72;

program
  .version(package.version)
  .option('-i, --items <name[,name]>', 'Names of items', names)
  .option('-f, --file <name>', 'File name')
  .parse(process.argv)

let allItems = [].concat(items, scrolls)

const itemsIndex = allItems.reduce((initial, item) => { initial[item.name] = item; return initial }, {})
let doc = new pdfkit({ margin: inchesToPoints(1) }) 

doc.pipe(fs.createWriteStream(program.file))
doc.font('Asimov.otf')

program.items.forEach(item => {
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

