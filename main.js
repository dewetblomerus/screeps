const spawnCreeps = require('creep.spawner')
const manageCreeps = require('creep.manager')
const towerManager = require('tower.manager')
const clearMemory = require('clearMemory')
const targetState = require('creep.targetState')

module.exports.loop = function() {
  clearMemory()
  spawnCreeps(targetState())
  manageCreeps()

  for (const name in Game.rooms) {
    const currentRoom = Game.rooms[name]
    const currentRoomName = currentRoom.name
    towerManager.run(currentRoomName)
  }
}
