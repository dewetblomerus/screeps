const _ = require('lodash')

const countCreeps = role => {
  const filteredCreeps = _.filter(
    Game.creeps,
    creep => creep.memory.role === role && creep.ticksToLive > 50
  ).length

  return filteredCreeps
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

  const energyUpdate = `Energy: ${room.energyAvailable}/${
    room.energyCapacityAvailable
  }`

  console.log(`${populationUpdate} ${energyUpdate}`)
}

module.exports = statusUpdate
