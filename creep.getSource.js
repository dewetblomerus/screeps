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

const sourceStructures = creep =>
  creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      sourceTypes.includes(structure.structureType) &&
      containsMinEnergy(structure) &&
      structureUtils.isSourceStructure(structure),
  })

const anyStructures = creep =>
  creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      sourceTypes.includes(structure.structureType) &&
      containsMinEnergy(structure),
  })

const chooseSource = creep => {
  const sourceStr = sourceStructures(creep)
  const structures = sourceStr.length > 0 ? sourceStr : anyStructures(creep)
  const newSource = creep.pos.findClosestByRange(structures)
  return newSource
}

const getSource = creep => chooseSource(creep)

module.exports = getSource
