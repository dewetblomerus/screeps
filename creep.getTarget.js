const structureUtils = require('./structure.utils')

const targetPriorities = [
  ['extension', 7],
  ['spawn', 6],
  ['tower', 5],
  ['link', 3],
  ['container', 2],
  ['storage', 1],
]

const targetTypes = [
  STRUCTURE_EXTENSION,
  STRUCTURE_SPAWN,
  STRUCTURE_TOWER,
  STRUCTURE_STORAGE,
  STRUCTURE_CONTAINER,
  STRUCTURE_LINK,
]

const notEnoughStorage = room => room.storage.store[RESOURCE_ENERGY] < 50000

const adjustPriority = (structureType, priority, room) => {
  if (structureType === 'storage') {
    if (notEnoughStorage(room)) {
      return 4
    }
  }

  return priority
}

const adjustedPriorities = room => {
  return targetPriorities.map(([structureType, priority]) => [
    structureType,
    adjustPriority(structureType, priority, room),
  ])
}

const targetsNeedingEnergy = room =>
  room.find(FIND_STRUCTURES, {
    filter: structure =>
      targetTypes.includes(structure.structureType) &&
      !structureUtils.full(structure),
  })

const chooseStructureType = room => {
  const structures = targetsNeedingEnergy(room)
  const structureTypesNeedingEnergy = structures.map(
    structure => structure.structureType
  )

  const relevantPriorities = adjustedPriorities(room).filter(
    ([structureType]) => structureTypesNeedingEnergy.includes(structureType)
  )

  if (relevantPriorities.length > 0) {
    const structureType = relevantPriorities.reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0]

    return structureType
  }
  return STRUCTURE_STORAGE
}

const structuresOfType = (room, structureType) =>
  room.find(FIND_STRUCTURES, {
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

const chooseTarget = (creep, room) => {
  const structureType = chooseStructureType(room)
  if (structureType === STRUCTURE_STORAGE) {
    return room.storage
  }

  if (structureType === STRUCTURE_CONTAINER) {
    return creep.pos.findClosestByRange(destinationContainers(room))
  }

  const potentialTargets = structuresOfType(room, structureType)
  const newTarget = creep.pos.findClosestByRange(potentialTargets)
  return newTarget
}

const getTarget = creep => {
  if (creep.memory.target) {
    // const target = Game.getObjectById(creep.memory.target)
    // console.log(`target: ${target}`)
  }

  homeRoom = Game.rooms[creep.memory.homeRoom]
  chosenTarget = chooseTarget(creep, homeRoom)
  if (chosenTarget) {
    creep.memory.target = chosenTarget.id
  }

  return Game.getObjectById(creep.memory.target)
}

module.exports = getTarget
