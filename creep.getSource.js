const structureUtils = require('./structure.utils')

const minEnergyToMove = 300

const storeTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE]
const sourceTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK]

const containsEnergy = structure => {
  if (storeTypes.includes(structure.structureType)) {
    return structure.store[RESOURCE_ENERGY]
  }
  return structure.energy
}

const containsMinEnergy = structure =>
  containsEnergy(structure) > minEnergyToMove

const sourceStructures = creep => {
  if (structureUtils.storageLink(creep.room)) {
    // console.log('there is a source link')
    if (structureUtils.storageLink(creep.room).energy > minEnergyToMove) {
      // console.log('it has enough')
      return structureUtils.storageLink(creep.room)
    }
  }

  return creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      sourceTypes.includes(structure.structureType) &&
      containsMinEnergy(structure) &&
      structureUtils.isSourceStructure(structure),
  })
}

const anyStructures = creep =>
  creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      sourceTypes.includes(structure.structureType) &&
      containsMinEnergy(structure),
  })

const chooseSource = creep => {
  if (creep.room.storage) {
    if (creep.room.storage.store[RESOURCE_ENERGY] > 990000) {
      console.log('it has over 990000')
      return creep.room.storage
    }
  }

  const sourceStr = sourceStructures(creep)
  const structures = sourceStr.length > 0 ? sourceStr : anyStructures(creep)
  const newSource = creep.pos.findClosestByRange(structures)
  return newSource
}

const getSource = creep => chooseSource(creep)

module.exports = getSource
