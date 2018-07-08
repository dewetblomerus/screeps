const creepSpawner = require('creep.spawner');
const creepManager = require('creep.manager');
const towerManager = require('tower.manager');

module.exports.loop = function() {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }

  creepSpawner.run();
  creepManager.run();
  for (const name in Game.rooms) {
    //currentRoom is now the instance of the roomobject
    const currentRoom = Game.rooms[name];
    const currentRoomName = currentRoom.name;
    //Example:
    //console.log("--- > currentRoom energy available: " + currentRoom.energyAvailable );

    // console.log('currentRoomName ' + currentRoomName);
    towerManager.run(currentRoomName);
  }
};
