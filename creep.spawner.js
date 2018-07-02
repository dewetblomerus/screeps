const _ = require('lodash');

const targetState = {
  harvester: 4,
  upgrader: 5,
  builder: 0
};

const countCreeps = role => {
  var filteredCreeps = _.filter(Game.creeps, function(creep) {
    return creep.memory.role == role && creep.ticksToLive > 12;
  }).length;

  return filteredCreeps;
};

const logStuff = () => {
  console.log('from logStuff');
};

const creepSpawner = {
  run() {
    logStuff();
    for (const role in targetState) {
      const targetNumber = targetState[role];
      this.matchTarget(role, targetNumber);
    }
  },

  spawnCreepWithRole(role) {
    const result = Game.spawns['Spawn1'].spawnCreep(
      [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
      `${role} ${Game.time}`,
      {
        memory: { role: role }
      }
    );
    if (_.isString(result)) {
      console.log('The name is: ' + result);
    } else {
      console.log('Spawn error: ' + result);
    }
  },

  matchTarget(role, targetNumber) {
    if (countCreeps(role) < targetNumber) {
      console.log(`${countCreeps(role)} of ${targetNumber} ${role}s`);
      this.spawnCreepWithRole(role);
    } else {
      // console.log(`We have enough ${creepRole}s`);
    }
  }
};

module.exports = creepSpawner;
