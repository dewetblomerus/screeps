const structureUtils = require('./structure.utils')

const targetPriorities = {
  extension: { slug: STRUCTURE_EXTENSION, priority: 0 },
  spawn: { slug: STRUCTURE_SPAWN, priority: 1 },
  tower: { slug: STRUCTURE_TOWER, priority: 2 },
  // container: { slug: 'sourceContainer', priority: 4 },
  link: { slug: STRUCTURE_LINK, priority: 4 },
  container: { slug: STRUCTURE_CONTAINER, priority: 5 },
  storage: { slug: STRUCTURE_STORAGE, priority: 6 },
}

const targetTypes = [
  STRUCTURE_EXTENSION,
  STRUCTURE_SPAWN,
  STRUCTURE_TOWER,
  STRUCTURE_STORAGE,
  STRUCTURE_CONTAINER,
  STRUCTURE_LINK,
]

const targetsNeedingEnergy = creep =>
  creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      targetTypes.includes(structure.structureType) &&
      !structureUtils.full(structure),
  })

const chooseStructureType = creep => {
  const structures = targetsNeedingEnergy(creep)
  const structureTypesNeedingEnergy = structures.map(
    structure => structure.structureType
  )
  if (structureTypesNeedingEnergy.length > 0) {
    // console.log('there are targets');
    const structureType = structureTypesNeedingEnergy.reduce(
      (a, b) =>
        targetPriorities[a].priority < targetPriorities[b].priority ? a : b
    )

    return structureType
  }
  return STRUCTURE_STORAGE
}

const structuresOfType = (creep, structureType) =>
  creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      structure.structureType === structureType &&
      structure.energy < structure.energyCapacity,
  })

const destinationContainers = room =>
  room.find(FIND_STRUCTURES, {
    filter: s =>
      s.structureType === STRUCTURE_CONTAINER &&
      s.pos.findInRange(FIND_SOURCES, 2).length === 0,
  })

const chooseTarget = creep => {
  const structureType = chooseStructureType(creep)
  if (structureType === STRUCTURE_STORAGE) {
    return creep.room.storage
  }

  if (structureType === STRUCTURE_CONTAINER) {
    return creep.pos.findClosestByRange(destinationContainers(creep.room))
  }

  const potentialTargets = structuresOfType(creep, structureType)
  const newTarget = creep.pos.findClosestByRange(potentialTargets)
  return newTarget
}

const getTarget = creep => {
  if (creep.memory.target) {
    // const target = Game.getObjectById(creep.memory.target)
    // console.log(`target: ${target}`)
  }

  if (chooseTarget(creep)) {
    creep.memory.target = chooseTarget(creep).id
  }

  return Game.getObjectById(creep.memory.target)
}

module.exports = getTarget
