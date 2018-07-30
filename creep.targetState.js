const workerBody = [WORK, WORK, CARRY, MOVE]

const balancedBody = [WORK, CARRY, MOVE]

const carrierBody = [CARRY, MOVE]

const startingOut = (energyCapacity, creepsCount) => {
  return energyCapacity === 300 || creepsCount < 2
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

const useContainers = () => {
  if (building()) {
    console.log('building')
    return {
      upgrader: { amount: 1, body: balancedBody, priority: 1 },
      worker: { amount: 2, body: workerBody, priority: 3 },
      carrier: { amount: 2, body: carrierBody, priority: 2 },
      builder: { amount: 2, body: balancedBody, priority: 4 },
    }
  }

  console.log('returningDefault')
  return {
    worker: { amount: 2, body: workerBody, priority: 2 },
    carrier: { amount: 2, body: carrierBody, priority: 1 },
    builder: { amount: 0, body: balancedBody, priority: 4 },
    upgrader: { amount: 5, body: balancedBody, priority: 5 },
  }
}

const targetState = () => {
  if (containersAvailable()) {
    console.log('containersAvailable')
    return useContainers()
  }

  if (building()) {
    console.log('building')
    return {
      harvester: { amount: 2, body: balancedBody, priority: 0 },
      upgrader: { amount: 1, body: balancedBody, priority: 1 },
      builder: { amount: 2, body: balancedBody, priority: 3 },
    }
  }

  const energyCapacity = Game.spawns['Spawn1'].room.energyCapacityAvailable
  if (startingOut(energyCapacity, 2)) {
    console.log('startingOut')
    return {
      harvester: { amount: 4, body: balancedBody, priority: 0 },
      upgrader: { amount: 3, body: balancedBody, priority: 1 },
    }
  }
}

module.exports = targetState
