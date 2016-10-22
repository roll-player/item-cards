const schemas = require('./schemas')

// project the value from an iterable as the object { name : name }
const asCheckboxItem = name => { return { name } }

const operationMode = [
  {
    name: 'opMode',
    type: 'list',
    message: 'What do you wish to do?',
    choices: [
      'Create an Item',
      'Generate Item Cards',
      'Exit'
    ]
  }
]

const itemCreation = [
  {
    name: 'name',
    type: 'input',
    message: 'What is the items name?'
  },
  {
    name: 'type',
    type: 'list',
    message: 'What type of item is this?',
    choices: schemas.equipmentType
  },
  {
    type: 'checkbox',
    name: 'requirements',
    message: 'Does this item have any requirements? - Check all that apply',
    choices: schemas.requirement.map(asCheckboxItem)
  },
  {
    type: 'checkbox',
    name: 'abilityScoreRequiredBy',
    message: 'Select any ability scores required',
    choices: schemas.requirement.map(asCheckboxItem),
    when: answers => answers.requirements.indexOf('Ability Score') !== -1
  },
  {
    type: 'checkbox',
    name: 'alignmentRequiredBy',
    message: 'Select any alignment requirements:',
    choices: schemas.alignment.map(asCheckboxItem),
    when: answers => answers.requirements.indexOf('Alignment') !== -1
  },
  {
    type: 'checkbox',
    name: 'classRequiredBy',
    message: 'Select any class requirements:',
    choices: schemas.class.map(asCheckboxItem),
    when: answers => answers.requirements.indexOf('Class') !== -1
  },
  {
    type: 'list',
    name: 'rarity',
    message: 'What rarity is this item?',
    choices: schemas.rarity
  },
  {
    type: 'input',
    name: 'description',
    message: 'What is this items description?'
  }
]

module.exports = {
  itemCreation,
  operationMode
}
