const creepsInRoom = () => {
  const allCreepsCount = Object.keys(Game.creeps).length
  return allCreepsCount
}

const startingOut = creepsCount => creepsCount < 3

const building = () => {
  const constructionSites = Game.spawns.Spawn1.room.find(
    FIND_CONSTRUCTION_SITES
  )
  return constructionSites.length > 0
}

const containersAvailable = () => {
  const containers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_CONTAINER,
  })
  return containers.length > 1
}

const linksAvailable = () => {
  const links = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_LINK,
  })
  return links.length > 1
}

const useContainers = () => {
  // console.log('using containers')
  if (building()) {
    // console.log('building')
    return {
      worker: { amount: 2, priority: 0 },
      carrier: { amount: 2, priority: 1 },
      upgrader: { amount: 1, priority: 2 },
      builder: { amount: 2, priority: 4 },
    }
  }

  // console.log('returningDefault')
  return {
    worker: { amount: 2, priority: 0 },
    carrier: { amount: 2, priority: 1 },
    upgrader: { amount: 1, priority: 2 },
  }
}

const useLinks = () => {
  // console.log('using containers')
  if (building()) {
    // console.log('building')
    return {
      worker: { amount: 2, priority: 0 },
      carrier: { amount: 1, priority: 1 },
      upgrader: { amount: 1, priority: 2 },
      builder: { amount: 2, priority: 4 },
    }
  }

  // console.log('returningDefault')
  return {
    worker: { amount: 2, priority: 0 },
    carrier: { amount: 1, priority: 1 },
    upgrader: { amount: 1, priority: 2 },
  }
}

const targetState = () => {
  // console.log('inside targetState')
  if (startingOut(creepsInRoom())) {
    // console.log('startingOut')
    return {
      harvester: { amount: 4, priority: 0 },
      upgrader: { amount: 1, priority: 1 },
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
      harvester: { amount: 2, priority: 0 },
      upgrader: { amount: 1, priority: 1 },
      builder: { amount: 2, priority: 3 },
    }
  }

  return {
    harvester: { amount: 4, priority: 0 },
    upgrader: { amount: 1, priority: 1 },
  }
}

module.exports = targetState
