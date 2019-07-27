const structureUtils = require('./structure.utils')

const minEnergyToMove = 300

const storeTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE]
const supplyTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK]

const supplyStructurePriorities = [
  ['container', 10],
  ['link', 10],
  ['storage', 10],
]

const notEnoughStorage = room => room.storage.store[RESOURCE_ENERGY] < 50000

const prioritizeUpgrading = room => {
  const upgraderStructure = structureUtils.upgraderStructures(room)[0]

  if (upgraderStructure.structureType === STRUCTURE_LINK) {
    return (
      upgraderStructure.energy < 500 &&
      room.storage.store[RESOURCE_ENERGY] > 5000
    )
  }

  return false
}

const adjustPriority = (structureType, priority, room) => {
  if (structureType === 'storage') {
    if (room.storage) {
      if (notEnoughStorage(room)) {
        return priority - 1
      }

      if (prioritizeUpgrading(room)) {
        return priority + 1
      }
    }
    return priority
  }

  return priority
}

const containsEnergy = structure => {
  if (storeTypes.includes(structure.structureType)) {
    return structure.store[RESOURCE_ENERGY]
  }
  return structure.energy
}

const containsMinEnergy = structure =>
  containsEnergy(structure) > minEnergyToMove

const adjustedPriorities = creep => {
  return supplyStructurePriorities.map(([structureType, priority]) => [
    structureType,
    adjustPriority(structureType, priority, creep.room),
  ])
}

const supplyStructures = creep => {
  if (structureUtils.storageLink(creep.room)) {
    // console.log('there is a supply link')
    if (structureUtils.storageLink(creep.room).energy > minEnergyToMove) {
      // console.log('it has enough')
      return structureUtils.storageLink(creep.room)
    }
  }

  return creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      supplyTypes.includes(structure.structureType) &&
      containsMinEnergy(structure) &&
      structureUtils.isSourceStructure(structure),
  })
}

const anyStructures = creep =>
  creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      supplyTypes.includes(structure.structureType) &&
      containsMinEnergy(structure),
  })

const chooseStructureType = creep => {
  const structures = anyStructures(creep)

  const structureTypesWithEnergy = structures.map(
    structure => structure.structureType
  )

  const relevantPriorities = adjustedPriorities(creep).filter(
    ([structureType]) => structureTypesWithEnergy.includes(structureType)
  )
  if (relevantPriorities.length > 0) {
    const structureType = relevantPriorities.reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0]

    return structureType
  }
  return STRUCTURE_STORAGE
}

const chooseSupply = creep => {
  const structureType = chooseStructureType(creep)
  if (structureType === STRUCTURE_STORAGE) {
    return creep.room.storage
  }

  if (structureType === STRUCTURE_CONTAINER) {
    return creep.pos.findClosestByRange(
      structureUtils.destinationContainers(creep.room)
    )
  }

  if (structureType === STRUCTURE_LINK) {
    return structureUtils.storageLink(creep.room)
  }
}

const getSupply = creep => chooseSupply(creep)

module.exports = getSupply
