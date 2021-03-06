const program = require('commander')
const nameRegex = /(.+?)(\[(\d)\]|)$/ 
const main = require('../core/main')
const package = require('../package.json')

const names = value =>  { 
  const names = value.split(',').map(name => name.trim())

  return names.map(name => {
    let matches = nameRegex.exec(name)
    let itemName = matches[1].trim()
    let count = matches[3] || 1

    return {
      name: itemName,
      count
    }
  })
}

module.exports = _ => {
  program
    .version(package.version)
    .option('-i, --items <name[,name]>', 'Names of items', names)
    .option('-f, --file <name>', 'File name')
    .parse(process.argv)
  console.log('Generating PDF')

  main.generatePdf(program.items, { fileName: program.file })
    .then(result => console.log(`Items generated at ${result}`))
    .catch(err => console.error(err))
}
