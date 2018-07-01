var creepCounter = {
  run: function() {
    console.log(Object.keys(Game.creeps).length);
    return Object.keys(Game.creeps).length;
  }
};

var creepSpawner = {
  run: function() {
    if (creepCounter.run() < 2) {
      console.log('we have less than two creeps');
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], {
        memory: { role: 'harvester' }
      });
    } else {
      console.log('we have more than one screep');
    }
  }
};

module.exports = creepSpawner;
