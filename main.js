const spawnCreeps = require('creep.spawner')
const manageCreeps = require('creep.manager')
const towerManager = require('tower.manager')
const clearMemory = require('clearMemory')
const targetState = require('creep.targetState')

module.exports.loop = function() {
  // const targetCreepState = targetState()
  clearMemory()
  spawnCreeps(targetState())
  manageCreeps()

  for (const name in Game.rooms) {
    //currentRoom is now the instance of the roomobject
    const currentRoom = Game.rooms[name]
    const currentRoomName = currentRoom.name
    //Example:
    //console.log("--- > currentRoom energy available: " + currentRoom.energyAvailable );

    // console.log('currentRoomName ' + currentRoomName);
    towerManager.run(currentRoomName)
  }
}
