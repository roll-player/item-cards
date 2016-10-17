const fs = require('fs')
const spells = require('../data/spells.json')

const lookup = spell => {
  switch (spell.level) {
    case 0:
    case 1:
      return {
        DC: 13,
        attackBonus: 5,
        rarity: 'Common'
      }
    case 2:
      return {
        DC: 13,
        attackBonus: 5,
        rarity: 'Uncommon'
      }
    case 3:
      return {
        DC: 15,
        attackBonus: 7,
        rarity: 'Uncommon'
      }
    case 4:
      return {
        DC: 15,
        attackBonus: 7,
        rarity: 'Rare'
      }
    case 5:
      return {
        DC: 17,
        attackBonus: 9,
        rarity: 'Rare'
      }
    case 6:
      return {
        DC: 17,
        attackBonus: 9,
        rarity: 'Very Rare'
      }
    case 7:
    case 8:
      return {
        DC: 18,
        attackBonus: 10,
        rarity: 'Very Rare'
      }
    case 9:
      return {
        DC: 19,
        attackBonus: 11,
        rarity: 'Legendary'
      }
  }
}

const scrolls = Object.keys(spells).map(key => {
  let spell = spells[key]
  let { DC, attackBonus, rarity } = lookup(spell)
  spell.name = key

  return {
    name: `Scroll of ${spell.name}`,
    type: 'Scroll',
    rarity,
    cost: `${spell.level * 100 || 50} GP`,
    description: `This scroll allows the reader to cast ${spell.name}. The spell has a DC of ${DC} and an Spell Attack Bonus of ${attackBonus}. The scroll is destroyed upon reading.`
  }
})

fs.writeFile('scrolls.json', JSON.stringify(scrolls), err => {
  if (err) {
    console.error(err)
  }
})
