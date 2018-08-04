const workerBody = [WORK, WORK, CARRY, MOVE]
const balancedBody = [WORK, CARRY, MOVE]
const carrierBody = [CARRY, MOVE]

const creepsInRoom = () => {
  const all = true
  var filteredCreeps = _.filter(Game.creeps, function(all) {
    return all
  }).length

  return filteredCreeps
}

const startingOut = creepsCount => {
  return creepsCount < 3
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

const linksAvailable = () => {
  const links = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
    filter: structure => {
      return structure.structureType === STRUCTURE_LINK
    },
  })
  return links.length > 1
}

const useContainers = () => {
  // console.log('using containers')
  if (building()) {
    // console.log('building')
    return {
      worker: { amount: 2, body: workerBody, priority: 0 },
      carrier: { amount: 2, body: carrierBody, priority: 1 },
      upgrader: { amount: 1, body: balancedBody, priority: 2 },
      builder: { amount: 2, body: balancedBody, priority: 4 },
    }
  }

  // console.log('returningDefault')
  return {
    worker: { amount: 2, body: workerBody, priority: 0 },
    carrier: { amount: 2, body: carrierBody, priority: 1 },
    upgrader: { amount: 1, body: balancedBody, priority: 2 },
  }
}

const useLinks = () => {
  // console.log('using containers')
  if (building()) {
    // console.log('building')
    return {
      worker: { amount: 2, body: workerBody, priority: 0 },
      carrier: { amount: 1, body: carrierBody, priority: 1 },
      upgrader: { amount: 1, body: balancedBody, priority: 2 },
      builder: { amount: 2, body: balancedBody, priority: 4 },
    }
  }

  // console.log('returningDefault')
  return {
    worker: { amount: 2, body: workerBody, priority: 0 },
    carrier: { amount: 1, body: carrierBody, priority: 1 },
    upgrader: { amount: 1, body: balancedBody, priority: 2 },
  }
}

const startState = {
  harvester: { amount: 4, body: balancedBody, priority: 0 },
  upgrader: { amount: 1, body: balancedBody, priority: 1 },
}

const targetState = () => {
  // console.log('inside targetState')
  if (startingOut(creepsInRoom())) {
    // console.log('startingOut')
    return {
      harvester: { amount: 4, body: balancedBody, priority: 0 },
      upgrader: { amount: 1, body: balancedBody, priority: 1 },
    }
  }

  if (containersAvailable()) {
    // console.log('containersAvailable')
    return useContainers()
  }

  if (linksAvailable()) {
    // console.log('containersAvailable')
    return useLinks()
  }

  if (building()) {
    // console.log('building')
    return {
      harvester: { amount: 2, body: balancedBody, priority: 0 },
      upgrader: { amount: 1, body: balancedBody, priority: 1 },
      builder: { amount: 2, body: balancedBody, priority: 3 },
    }
  }

  return {
    harvester: { amount: 4, body: balancedBody, priority: 0 },
    upgrader: { amount: 1, body: balancedBody, priority: 1 },
  }
}

module.exports = targetState
