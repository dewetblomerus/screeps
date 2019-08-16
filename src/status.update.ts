import { countCreeps } from './creep/utils'
import { TargetState, Role } from './config'

const statusUpdate = (targetState: TargetState, room: Room) => {
  if (Game.time % 10 !== 0) {
    return
  }

  const populationUpdate = `Population:${Object.keys(targetState).map(role => {
    // console.log(role)
    if (countCreeps(role) > 0) {
      // @ts-ignore
      return ` ${role}: ${countCreeps(role)}/${targetState[role].amount}`
    }
    return `${role}: 0`
  })}`

  const energyUpdate = `Energy: ${room.energyAvailable}/${room.energyCapacityAvailable}`

  console.log(`${populationUpdate} ${energyUpdate}`)
}

export default statusUpdate
