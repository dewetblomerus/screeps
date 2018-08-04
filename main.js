const spawnCreeps = require('creep.spawner')
const manageCreeps = require('creep.manager')
const towerManager = require('tower.manager')
const clearMemory = require('clearMemory')
const targetState = require('creep.targetState')
const weighRoles = require('weighRoles')
const manageLinks = require('manageLinks')

module.exports.loop = function() {
  const room = Game.spawns['Spawn1'].room
  weighRoles(room)
  clearMemory()
  spawnCreeps(targetState())
  manageCreeps()

  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName]
    towerManager.run(room)
    manageLinks(room)
  }
}
