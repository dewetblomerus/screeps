const countCreeps = (role: string) => {
  return Object.values(Game.creeps).filter(
    creep => creep.memory.role === role && creep.ticksToLive > 50
  ).length
}

const statusUpdate = (targetState, room) => {
  if (Game.time % 10 !== 0) {
    return
  }

  const populationUpdate = `Population:${Object.keys(targetState).map(role => {
    // console.log(role)
    if (countCreeps(role) > 0) {
      return ` ${role}: ${countCreeps(role)}/${targetState[role].amount}`
    }
    return `${role}: 0`
  })}`

  const energyUpdate = `Energy: ${room.energyAvailable}/${room.energyCapacityAvailable}`

  console.log(`${populationUpdate} ${energyUpdate}`)
}

export default statusUpdate
