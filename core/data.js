const debug = require('debug')('datastore')
const datastore = require('nedb')
const path = require('path')
const dbPath = path.join(__dirname, '../data/persist')
debug(dbPath)
const db = new datastore({ filename: dbPath })

db.ensureIndex({ fieldName: 'name', unique: true }, (err) => {
  if (err) {
    throw new Error(err)
  }
})

try {
  db.loadDatabase()
} catch (err) {
  debug(err)
}
const addItem = item => {
  return new Promise((resolve, reject) => {
    db.update({ name: item.name }, item, { upsert: true }, (err, numReplaced, upsert) => {
      if (err) {
        debug(`$Error in updating item {err}`)
        reject(err)
        return
      }

      debug(`Upserted item called ${item.name}`)
      resolve()
    })
  })
}

const findItem = name => {
  return new Promise((resolve, reject) => {
    db.find({ name }, { id: 0 }, (err, docs) => {
      if (err) {
        debug(`Error finding item with name ${name}`)
        reject(err)
        return
      }

      debug(`Found ${docs.length} item(s) with name ${name}`)
      resolve(docs)
      return
    })
  })
}

module.exports = {
  findItem,
  addItem
}
