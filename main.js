const creepSpawner = require('creep.spawner');
const creepManager = require('creep.manager');

module.exports.loop = function() {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }

  creepSpawner.run();
  creepManager.run();
};
