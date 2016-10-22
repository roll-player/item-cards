const debug = require('debug')('cli')
const inquirer = require('inquirer')

const package = require('../package.json')
const main = require('./main')
const questions = require('./questions')
const data = require('./data')

const nameRegex = /(.+?)(\[(\d)\]|)$/ 

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


const asItem = item => {
  return item
}

const questionsAsPromise = questionSet => {
  return new Promise((resolve, reject) => {
    if (!questionSet || questionSet.length === 0) {
      debug(`questionSet appears to be invalid`)
    }

    inquirer.prompt(questionSet)
      .then(resolve)
      .catch(reject)
  })
}

const itemCreate = () => questionsAsPromise(questions.itemCreation)

const promptSaveItem = item => {
  const saveIfExists = [{
    type: 'confirm',
    name: 'saveExisting',
    message: `An item with the namme ${item.name} do you want to overwrite?`
  }]

  return new Promise((resolve, reject) => {
    debug('checking for an existing item')

    data.findItem(item.name)
      .then(found => { 
        if (found) {
          debug('found existing item')

          const confirmation = questionsAsPromise(saveIfExists)
            .then(answer => {
              debug(`Confirmation ${answer}`)
              if (answer.saveExisting) {
                return data.addItem(item)
              }
            })
          resolve(confirmation)
        } else {
          debug('no item to overwrite')
          resolve(data.addItem(item))
        }
      })
    })
}

const renderer = () => {
  questionsAsPromise(questions.operationMode).then(answer => {
    switch (answer.opMode) {
      case 'Create an Item':
        debug('creating item')
        itemCreate()
          .then(item => { 
            debug('Item Created Succesfully')
            promptSaveItem(item)
          })
          .catch(err => debug(err))
        break
      case 'Generate Item Cards':
        main.generatePdf([])
          .then(result => debug(`Items generated at ${result}`))
          .catch(err => debug(err))
        break
    }
  }).catch(err => debug(`Invalid operation mode ${err}`))
}

module.exports = renderer
