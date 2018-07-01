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
  targetNumber: 7,
  creepRole: 'harvester',
  run: function() {
    console.log(`Upgrader Count: ${creepCounter.run(this.creepRole)}`);
    if (creepCounter.run(this.creepRole) < this.targetNumber) {
      console.log(`we have less than ${this.targetNumber} creeps`);
      const result = Game.spawns['Spawn1'].spawnCreep(
        [WORK, CARRY, MOVE],
        `Creep ${Math.floor(Math.random() * 1000 + 1)}`,
        {
          memory: { role: this.creepRole }
        }
      );
      if (_.isString(result)) {
        console.log('The name is: ' + result);
      } else {
        console.log('Spawn error: ' + result);
      }
    } else {
      console.log(`We have enough creeps`);
    }
  }
};

module.exports = creepSpawner;
