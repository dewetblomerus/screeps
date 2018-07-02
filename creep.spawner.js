var _ = require('lodash');

var targetState = {
  harvester: 2,
  upgrader: 3,
  builder: 3
};

var creepCounter = {
  run: function(unitRole) {
    var filteredCreeps = _.filter(Game.creeps, function(creep) {
      return creep.memory.role == unitRole && creep.ticksToLive > 12;
    }).length;

    return filteredCreeps;
  }
};

var creepSpawner = {
  run: function() {
    for (const role in targetState) {
      const targetNumber = targetState[role];
      this.matchTarget(role, targetNumber);
    }
  },

  matchTarget: function(creepRole, targetNumber) {
    if (creepCounter.run(creepRole) < targetNumber) {
      console.log(
        `${creepCounter.run(creepRole)} of ${targetNumber} ${creepRole}s`
      );
      const result = Game.spawns['Spawn1'].spawnCreep(
        [WORK, CARRY, MOVE],
        `${creepRole} ${Game.time}`,
        {
          memory: { role: creepRole }
        }
      );
      if (_.isString(result)) {
        console.log('The name is: ' + result);
      } else {
        console.log('Spawn error: ' + result);
      }
    } else {
      // console.log(`We have enough ${creepRole}s`);
    }
  }
};

module.exports = creepSpawner;
