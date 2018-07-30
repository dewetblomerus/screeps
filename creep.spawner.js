const _ = require('lodash')

const countCreepsInRoom = () => {
  const all = true
  var allCreeps = _.filter(Game.creeps, function(all) {
    return all
  }).length

  return allCreeps
}

const creepBody = (priorityBody, energyBudget) => {
  console.log(`energyBudget: ${energyBudget}`)
  let body = priorityBody
  const realisticBudget = energyBudget => {
    if (energyBudget > 2000) {
      return 2000
    } else {
      return energyBudget
    }
  }

  const budget = realisticBudget(energyBudget)
  console.log(`realisticBudget: ${budget}`)

  while (bodyCost(body) + bodyCost(priorityBody) <= budget) {
    body = [...body, ...priorityBody]
  }

  for (part of priorityBody) {
    if (bodyCost(body) + bodyPartCost[part] <= budget) {
      body = [...body, part]
    }
  }
  console.log(`body: ${body}`)
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

const bodyBudget = () => {
  if (countCreepsInRoom() < 4) {
    return Game.spawns['Spawn1'].room.energyAvailable
  }

  return Game.spawns['Spawn1'].room.energyCapacityAvailable
}

const spawnCreepWithRole = (role, bodyPriority) => {
  const builtBody = creepBody(bodyPriority, bodyBudget())

  const result = Game.spawns['Spawn1'].spawnCreep(
    builtBody,
    `${role} ${Game.time}`,
    {
      memory: { role: role },
    }
  )
  console.log(result)
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
    console.log(roleToSpawn)

    spawnCreepWithRole(roleToSpawn, targetState[roleToSpawn].body)
  }
}

module.exports = spawnCreeps
