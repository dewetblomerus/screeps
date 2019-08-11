import buildBody from './creep.buildBody'

const countCreeps = (role: string) => {
  return Object.values(Game.creeps).filter(
    creep => creep.memory.role === role && creep.ticksToLive > 50
  ).length
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
  if (typeof result === 'string') {
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

export default spawnCreeps
