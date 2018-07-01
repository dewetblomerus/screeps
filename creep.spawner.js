var _ = require('lodash');

var creepCounter = {
  run: function(unitRole) {
    console.log(`Total Creeps: ${Object.keys(Game.creeps).length}`);
    var filteredCreeps = _.filter(Game.creeps, function(creep) {
      return creep.memory.role == unitRole && creep.ticksToLive > 12;
    }).length;

    console.log(`Filtered Creeps: ${filteredCreeps}`);
    return Object.keys(Game.creeps).length;
  }
};

var creepSpawner = {
  targetNumber: 3,
  run: function() {
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
      console.log('we have more than one screep');
    }
  }
};

module.exports = creepSpawner;
