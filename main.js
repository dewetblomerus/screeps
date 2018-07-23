const creepSpawner = require('creep.spawner')
const creepManager = require('creep.manager')
const towerManager = require('tower.manager')
const clearMemory = require('clearMemory')

module.exports.loop = function() {
  clearMemory()

  creepSpawner.run()
  creepManager.run()
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
