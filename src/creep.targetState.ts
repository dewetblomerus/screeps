const debug = false

const creepsInRoom = () => {
  const allCreepsCount = Object.keys(Game.creeps).length
  return allCreepsCount
}

const startingOut = (creepsCount: Number) => creepsCount < 1

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

const linksAvailable = (room: Room) => {
  const links = room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_LINK,
  })
  return links.length > 1
}

const remoteMiners = () => {
  const flags = Object.keys(Game.flags)
  const yellowFlags = flags.filter(flag => Game.flags[flag].color === 6)
  return yellowFlags.length
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

const loaded = (room: Room) => {
  if (room.storage) {
    return room.storage.store[RESOURCE_ENERGY] > 200000
  }
  return false
}

const buffer = (room: Room) => {
  if (room.storage) {
    return room.storage.store[RESOURCE_ENERGY] > 1000
  }
  return false
}

const useLinks = (room: Room) => {
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

  if (loaded(room)) {
    return {
      worker: { amount: 2, priority: 0 },
      carrier: { amount: 1, priority: 1 },
      upgrader: { amount: 3, priority: 2 },
    }
  }

  if (debug) {
    console.log('returningDefault')
  }
  return {
    worker: { amount: 2, priority: 1 },
    carrier: { amount: 1, priority: 1 },
    upgrader: { amount: 1, priority: 2 },
    remoteMiner: { amount: remoteMiners(), priority: 3 },
    remoteCarrier: { amount: 1, priority: 3 },
  }
}

const targetState = (room: Room) => {
  remoteMiners()
  if (startingOut(creepsInRoom())) {
    if (debug) {
      console.log('startingOut')
    }
    if (buffer(room)) {
      if (Game.time % 10 === 0) {
        console.log('restarting with a buffer')
      }
      return {
        worker: { amount: 2, priority: 0 },
        carrier: { amount: 1, priority: 0 },
      }
    }
    // console.log('startingOut')
    return {
      harvester: { amount: 1, priority: 0 },
    }
  }

  if (containersAvailable()) {
    // console.log('containersAvailable')
    return useContainers()
  }

  if (linksAvailable(room)) {
    // console.log('containersAvailable')
    return useLinks(room)
  }

  if (building()) {
    // console.log('building')
    return {
      worker: { amount: 1, priority: 0 },
      carrier: { amount: 1, priority: 0 },
      upgrader: { amount: 1, priority: 2 },
      builder: { amount: 2, priority: 3 },
    }
  }

  // console.log('default target state')
  return {
    worker: { amount: 2, priority: 0 },
    carrier: { amount: 1, priority: 1 },
    upgrader: { amount: 3, priority: 2 },
  }
}

export default targetState
