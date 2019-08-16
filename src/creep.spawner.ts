import buildBody from './creep.buildBody'
import { countCreeps } from './creep/utils'
import { TargetState, Role } from './config'

const spawnCreepWithRole = (role: Role, room: Room) => {
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

const spawnCreeps = (targetState: TargetState, room: Room) => {
  const neededRoles = Object.keys(targetState).filter(
    // @ts-ignore
    role => countCreeps(role) < targetState[role].amount
  )

  if (neededRoles.length > 0) {
    const roleToSpawn = neededRoles.reduce((a, b) =>
      // @ts-ignore
      targetState[a].priority < targetState[b].priority ? a : b
    )

    // @ts-ignore
    spawnCreepWithRole(roleToSpawn, room)
  }
}

export default spawnCreeps
