const _ = require('lodash');

const targetState = {
  harvester: { amount: 2, priority: 0 },
  upgrader: { amount: 5, priority: 2 },
  builder: { amount: 0, priority: 1 }
};

const creepSpawner = {
  run() {
    const neededRoles = Object.keys(targetState).filter(role => {
      return countCreeps(role) < targetState[role].amount;
    });

    const update = Object.keys(targetState).map(role => {
      return ` ${role}s: ${countCreeps(role)}/${targetState[role].amount}`;
    });

    console.log(update);

    if (neededRoles.length > 0) {
      const roleToSpawn = neededRoles.reduce((a, b) => {
        return targetState[a].priority < targetState[b].priority ? a : b;
      });

      // console.log(`roleToSpawn: ${roleToSpawn}`);
      spawnCreepWithRole(roleToSpawn);
    }
  }
};

const countCreeps = role => {
  var filteredCreeps = _.filter(Game.creeps, function(creep) {
    return creep.memory.role == role && creep.ticksToLive > 200;
  }).length;

  return filteredCreeps;
};

const spawnCreepWithRole = role => {
  const result = Game.spawns['Spawn1'].spawnCreep(
    [
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE
    ],
    // [WORK, CARRY, MOVE],
    `${role} ${Game.time}`,
    {
      memory: { role: role }
    }
  );
  if (_.isString(result)) {
    console.log('The name is: ' + result);
  } else {
    // console.log('Spawn error: ' + result);
  }
};

module.exports = creepSpawner;
