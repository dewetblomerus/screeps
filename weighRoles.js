const creepsInRoom = room => {
  const creeps = room.find(FIND_MY_CREEPS, {})
  return creeps
}

const countCreepsInRoom = room => {
  return creepsInRoom(room).length
}

const startingOut = () => {
  return Game.spawns['Spawn1'].room.controller.level < 2
}

const reboot = () => {
  return countCreepsInRoom(Game.spawns['Spawn1'].room) < 2
}

const building = () => {
  const constructionSites = Game.spawns['Spawn1'].room.find(
    FIND_CONSTRUCTION_SITES
  )
  return constructionSites.length > 0
}

const containersAvailable = () => {
  const containers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
    filter: structure => {
      return structure.structureType === STRUCTURE_CONTAINER
    },
  })
  return containers.length > 1
}

const countCreeps = role => {
  const filteredCreeps = _.filter(Game.creeps, function(creep) {
    return creep.memory.role == role && creep.ticksToLive > 50
  }).length

  return filteredCreeps
}

const sourceContainers = room => {
  return room.find(FIND_STRUCTURES, {
    filter: s =>
      s.structureType === STRUCTURE_CONTAINER &&
      s.pos.findInRange(FIND_SOURCES, 2).length > 0,
  })
}

const energyInSourceContainers = room => {
  return sourceContainers(room).reduce(
    (total, container) => total + container.store[RESOURCE_ENERGY],
    0
  )
}

const enoughBuilders = () => {
  return countCreeps('builder') > 1
}

const enoughWorkers = () => {
  return countCreeps('worker') > 1
}

const enoughCarriers = () => {
  return countCreeps('carrier') > 1
}

const enoughHarvesters = () => {
  return countCreeps('harvester') > 1
}

const enoughUpgraders = () => {
  return countCreeps('upgrader') > 1
}

let roles = {
  builder: 0,
  carrier: 0,
  harvester: 0,
  upgrader: 0,
  worker: 0,
}

const weighRoles = room => {
  // console.log(sourceContainers(room))

  console.log(energyInSourceContainers(room))

  // console.log('creepsInRoom:')
  // console.log(countCreepsInRoom())
  if (startingOut()) {
    roles.harvester = 10
    roles.upgrader = 9
  }

  if (reboot()) {
    roles.harvester = 10
  }

  if (building()) {
    roles.builder = 1
  }

  if (containersAvailable()) {
    roles.worker = 10
    roles.carrier = 10
  }

  if (enoughBuilders()) {
    roles.builder = 0
  }

  if (enoughWorkers()) {
    roles.worker = 0
  }

  if (enoughCarriers()) {
    roles.carrier = 0
  }

  if (enoughHarvesters()) {
    roles.harvester = 0
  }

  if (enoughUpgraders()) {
    roles.upgrader = 0
  }

  // console.log(JSON.stringify(roles))
}

module.exports = weighRoles
