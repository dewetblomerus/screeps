const spawnCreeps = require('./creep.spawner')
const manageCreeps = require('./creep.manager')
const towerManager = require('./tower.manager')
const clearMemory = require('./clearMemory')
const targetState = require('./creep.targetState')
const weighRoles = require('./weighRoles')
const manageLinks = require('./manageLinks')

module.exports.loop = () => {
  clearMemory()
  manageCreeps()

  const roomsArray = Object.values(Game.rooms)
  for (const room of roomsArray) {
    weighRoles(room)
    spawnCreeps(targetState(room), room)
    towerManager.run(room)
    manageLinks(room)
  }
}
