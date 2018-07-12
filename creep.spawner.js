const _ = require('lodash');

const workerBody = [WORK, WORK, WORK, CARRY, MOVE];

const balancedBody = [WORK, CARRY, MOVE];

const carrierBody = [CARRY, MOVE];

const creepBody = (priorityBody, energyBudget) => {
  body = priorityBody;

  while (bodyCost(body) + bodyCost(priorityBody) <= energyBudget) {
    body = [...body, ...priorityBody];
  }

  for (part of priorityBody) {
    if (bodyCost(body) + bodyPartCost[part] <= energyBudget) {
      body = [...body, part];
    }
  }
  console.log(body);
  console.log(`bodyCost: ${bodyCost(body)} / ${energyBudget}`);
  return body;
};

const bodyPartCost = {
  work: 100,
  carry: 50,
  move: 50
};

const bodyCost = body => {
  return body.reduce((prev, bodyPart) => prev + bodyPartCost[bodyPart], 0);
};

const targetState = {
  harvester: { amount: 2, body: balancedBody, priority: 0 },
  upgrader: { amount: 1, body: balancedBody, priority: 1 },
  worker: { amount: 0, body: workerBody, priority: 3 },
  carrier: { amount: 0, body: carrierBody, priority: 2 },
  builder: { amount: 0, body: balancedBody, priority: 4 }
};

const creepSpawner = {
  run() {
    const calculatedBody = creepBody(
      [WORK, CARRY, MOVE],
      Game.spawns['Spawn1'].room.energyCapacityAvailable
    );

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
    creepBody(
      targetState[role].body,
      Game.spawns['Spawn1'].room.energyCapacityAvailable
    ),
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
