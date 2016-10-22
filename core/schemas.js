const abilityScore = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma']

const alignment = [ 'LG', 'LN', 'LE', 'NG', 'NN', 'NE', 'CG', 'CN', 'CE']

const classes = [
  'Barbarian', 
  'Bard', 
  'Cleric', 
  'Druid',
  'Fighter', 
  'Monk', 
  'Ranger', 
  'Sorceror', 
  'Warlock',
  'Wizard'
]

const equipmentType = [
  'Armor',
  'Arcane Focus',
  'Divine Focus',
  'Equipment',
  'Potion',
  'Mount',
  'Weapon'
]
const race = [
  'Dragonborn',
  'Dwarf',
  'Elf',
  'Giant',
  'Gnome',
  'Genasi',
  'Halfling',
  'Half-Elf',
  'Half-Orc',
  'Human',
  'Tiefling'
]

const rarity = [
  'Common',
  'Uncommon',
  'Rare',
  'Very Rare',
  'Legendary'
]

const requirement = [
  'Attunement',
  'Alignment',
  'Ability Score',
  'Class',
  'Race'
]

const attunementRequirements = classes.concat(['Spellcaster'])

module.exports = {
  abilityScore,
  alignment,
  class: classes,
  equipmentType,
  race,
  rarity,
  requirement
}
