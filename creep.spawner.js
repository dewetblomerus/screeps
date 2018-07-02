const _ = require('lodash');

const targetState = {
  harvester: 4,
  upgrader: 6,
  builder: 0
};

let currentState = {};

const logObject = object => {
  return Object.keys(object).map(role => `${role}: ${countCreeps(role)}`);
};

const creepSpawner = {
  run() {
    let currentState = {};

    for (const role in targetState) {
      currentState[role] = countCreeps(role);
    }

    console.log(`currentState: ${logObject(currentState)}`);
    console.log(`targetState: ${logObject(targetState)}`);

    for (const role in targetState) {
      const targetNumber = targetState[role];
      matchTarget(role, targetNumber);
    }
  }
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

module.exports = creepSpawner;
