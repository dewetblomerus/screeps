const _ = require('lodash')
const buildBody = require('creep.buildBody')

const countCreepsInRoom = () => {
  const all = true
  var allCreeps = _.filter(Game.creeps, function(all) {
    return all
  }).length

  return allCreeps
}

const countCreeps = role => {
  var filteredCreeps = _.filter(Game.creeps, function(creep) {
    return creep.memory.role == role && creep.ticksToLive > 50
  }).length

  return filteredCreeps
}

const spawnCreepWithRole = (role, room) => {
  const builtBody = buildBody(role, room)

  const result = Game.spawns['Spawn1'].spawnCreep(
    builtBody,
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

const spawnCreeps = (targetState, room) => {
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

  // console.log(`${populationUpdate} ${energyUpdate}`)

  if (neededRoles.length > 0) {
    const roleToSpawn = neededRoles.reduce((a, b) => {
      return targetState[a].priority < targetState[b].priority ? a : b
    })
    console.log(roleToSpawn)

    spawnCreepWithRole(roleToSpawn, room)
  }
}

module.exports = spawnCreeps
