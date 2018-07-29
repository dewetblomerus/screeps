const _ = require('lodash')

const creepBody = (priorityBody, energyBudget) => {
  body = priorityBody

  while (bodyCost(body) + bodyCost(priorityBody) <= energyBudget) {
    body = [...body, ...priorityBody]
  }

  for (part of priorityBody) {
    if (bodyCost(body) + bodyPartCost[part] <= energyBudget) {
      body = [...body, part]
    }
  }
  return body
}

const bodyPartCost = {
  work: 100,
  carry: 50,
  move: 50,
}

const bodyCost = body => {
  return body.reduce((prev, bodyPart) => prev + bodyPartCost[bodyPart], 0)
}

const countCreeps = role => {
  var filteredCreeps = _.filter(Game.creeps, function(creep) {
    return creep.memory.role == role && creep.ticksToLive > 50
  }).length

  return filteredCreeps
}

const spawnCreepWithRole = (role, bodyPriority) => {
  const result = Game.spawns['Spawn1'].spawnCreep(
    creepBody(bodyPriority, Game.spawns['Spawn1'].room.energyCapacityAvailable),
    `${role} ${Game.time}`,
    {
      memory: { role: role },
    }
  )
  if (_.isString(result)) {
    console.log('The name is: ' + result)
  } else {
  }
}

const spawnCreeps = targetState => {
  const neededRoles = Object.keys(targetState).filter(role => {
    return countCreeps(role) < targetState[role].amount
  })

  const populationUpdate = `Population:${Object.keys(targetState).map(role => {
    if (countCreeps(role) > 0) {
      return ` ${role}: ${countCreeps(role)}/${targetState[role].amount}`
    }
  })}`

  const energyUpdate = `Energy: ${Game.spawns['Spawn1'].room.energyAvailable}/${
    Game.spawns['Spawn1'].room.energyCapacityAvailable
  }`

  console.log(`${populationUpdate} ${energyUpdate}`)

  if (neededRoles.length > 0) {
    const roleToSpawn = neededRoles.reduce((a, b) => {
      return targetState[a].priority < targetState[b].priority ? a : b
    })

    spawnCreepWithRole(roleToSpawn, targetState[roleToSpawn].body)
  }
}

module.exports = spawnCreeps
