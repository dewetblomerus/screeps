var _ = require('lodash');

var creepCounter = {
  run: function(unitRole) {
    var filteredCreeps = _.filter(Game.creeps, function(creep) {
      return creep.memory.role == unitRole && creep.ticksToLive > 12;
    }).length;

    return filteredCreeps;
  }
};

var creepSpawner = {
  targetNumber: 3,
  creepRole: 'builder',
  run: function() {
    if (creepCounter.run(this.creepRole) < this.targetNumber) {
      console.log(`we have less than ${this.targetNumber} ${this.creepRole}s`);
      const result = Game.spawns['Spawn1'].spawnCreep(
        [WORK, CARRY, MOVE],
        `${this.creepRole} ${Game.time}`,
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
      console.log(`We have enough ${this.creepRole}s`);
    }
  }
};

module.exports = creepSpawner;
