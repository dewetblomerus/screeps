const _ = require('lodash');

const maxBody = [
  WORK,
  WORK,
  WORK,
  WORK,
  WORK,
  WORK,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE
];

const carrierBody = [
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE
];

const workerBody = [
  WORK,
  WORK,
  WORK,
  WORK,
  WORK,
  WORK,
  CARRY,
  CARRY,
  MOVE,
  MOVE
];

const smallBody = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
const currentBody = smallBody;

const minBody = [WORK, CARRY, MOVE];

const targetState = {
  harvester: { amount: 0, body: smallBody, priority: 0 },
  upgrader: { amount: 2, body: workerBody, priority: 5 },
  worker: { amount: 2, body: workerBody, priority: 1 },
  carrier: { amount: 4, body: carrierBody, priority: 2 },
  builder: { amount: 0, body: maxBody, priority: 4 }
};

const creepSpawner = {
  run() {
    const neededRoles = Object.keys(targetState).filter(role => {
      return countCreeps(role) < targetState[role].amount;
    });

    const populationUpdate = `Population:${Object.keys(targetState).map(
      role => {
        if (countCreeps(role) > 0) {
          return ` ${role}: ${countCreeps(role)}/${targetState[role].amount}`;
        }
      }
    )}`;

    const energyUpdate = `Energy: ${
      Game.spawns['Spawn1'].room.energyAvailable
    }/${Game.spawns['Spawn1'].room.energyCapacityAvailable}`;

    console.log(`${populationUpdate} ${energyUpdate}`);

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
    return creep.memory.role == role && creep.ticksToLive > 50;
  }).length;

  return filteredCreeps;
};

const spawnCreepWithRole = role => {
  // console.log(`roleToSpawn: ${role}`);
  // console.log(targetState[role].body);
  const result = Game.spawns['Spawn1'].spawnCreep(
    targetState[role].body,
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
