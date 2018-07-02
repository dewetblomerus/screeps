const _ = require('lodash');

const targetState = {
  harvester: 3,
  upgrader: 0,
  builder: 0
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
        [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
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
