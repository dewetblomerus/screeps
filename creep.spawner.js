var creepSpawner = {
  run: function() {
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Worker1', {
      memory: { role: 'harvester' }
    });
  }
};

module.exports = creepSpawner;
