const _ = require('lodash')
const buildBody = require('./creep.buildBody')

const countCreeps = role => {
  const filteredCreeps = _.filter(
    Game.creeps,
    creep => creep.memory.role === role && creep.ticksToLive > 50
  ).length

  return filteredCreeps
}

const spawnCreepWithRole = (role, room) => {
  const builtBody = buildBody(role, room)

  const result = Game.spawns.Spawn1.spawnCreep(
    builtBody,
    `${role} ${Game.time}`,
    {
      memory: { role },
    }
  )
  if (_.isString(result)) {
    console.log(`The name is: ${result}`)
  }
}

const spawnCreeps = (targetState, room) => {
  const neededRoles = Object.keys(targetState).filter(
    role => countCreeps(role) < targetState[role].amount
  )

  if (neededRoles.length > 0) {
    const roleToSpawn = neededRoles.reduce((a, b) =>
      targetState[a].priority < targetState[b].priority ? a : b
    )

    spawnCreepWithRole(roleToSpawn, room)
  }
}

module.exports = spawnCreeps
