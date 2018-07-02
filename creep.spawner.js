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

const spawnCreepWithRole = role => {
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
};

const matchTarget = (role, targetNumber) => {
  if (countCreeps(role) < targetNumber) {
    console.log(`${countCreeps(role)} of ${targetNumber} ${role}s`);
    spawnCreepWithRole(role);
  }
};

const creepSpawner = {
  run() {
    for (const role in targetState) {
      const targetNumber = targetState[role];
      matchTarget(role, targetNumber);
    }
  }
};

module.exports = creepSpawner;
