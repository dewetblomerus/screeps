var _ = require('lodash');

var creepCounter = {
  run: function(unitRole) {
    console.log(`Total Creeps: ${Object.keys(Game.creeps).length}`);
    var filteredCreeps = _.filter(Game.creeps, function(creep) {
      return creep.memory.role == unitRole && creep.ticksToLive > 12;
    }).length;

    return filteredCreeps;
  }
};

var creepSpawner = {
  targetNumber: 4,
  run: function() {
    console.log(`Harvester Count: ${creepCounter.run('harvester')}`);
    if (creepCounter.run('harvester') < this.targetNumber) {
      console.log(`we have less than ${this.targetNumber} creeps`);
      const result = Game.spawns['Spawn1'].spawnCreep(
        [WORK, CARRY, MOVE],
        `Creep ${Math.floor(Math.random() * 1000 + 1)}`,
        {
          memory: { role: 'harvester' }
        }
      );
      if (_.isString(result)) {
        console.log('The name is: ' + result);
      } else {
        console.log('Spawn error: ' + result);
      }
    } else {
      console.log('we have more than one creep');
    }
  }
};

module.exports = creepSpawner;
