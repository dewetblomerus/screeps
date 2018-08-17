const SOURCE_STRUCTURE_TYPES = [STRUCTURE_CONTAINER, STRUCTURE_LINK]
const UPGRADER_STRUCTURE_TYPES = [STRUCTURE_CONTAINER, STRUCTURE_LINK]
const RESOURCE_STRUCTURE_TYPES = [
  STRUCTURE_CONTAINER,
  STRUCTURE_LINK,
  STRUCTURE_STORAGE,
]
const STORE_STRUCTURE_TYPES = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE]

const structureUtils = {
  energyStructures(room, minEnergy = 50) {
    return room.find(FIND_MY_STRUCTURES, {
      filter: structure =>
        RESOURCE_STRUCTURE_TYPES.includes(structure.structureType) &&
        structureUtils.containsEnergy(structure) >= minEnergy,
    })
  },

  containsEnergy(structure) {
    if (STORE_STRUCTURE_TYPES.includes(structure.structureType)) {
      return structure.store[RESOURCE_ENERGY]
    }
    return structure.energy
  },

  isSourceStructure(structure) {
    if (SOURCE_STRUCTURE_TYPES.includes(structure.structureType)) {
      return structure.pos.findInRange(FIND_SOURCES, 2).length > 0
    }
    return false
  },

  isUpgraderStructure(structure) {
    if (UPGRADER_STRUCTURE_TYPES.includes(structure.structureType)) {
      return structure.pos.getRangeTo(structure.room.controller) < 5
    }
    return false
  },

  sourceStructures(room, structureTypes = SOURCE_STRUCTURE_TYPES) {
    return room.find(FIND_MY_STRUCTURES, {
      filter: structure =>
        structureTypes.includes(structure.structureType) &&
        structureUtils.isSourceStructure(structure),
    })
  },

  upgraderStructures(room, structureTypes = UPGRADER_STRUCTURE_TYPES) {
    return room.find(FIND_MY_STRUCTURES, {
      filter: structure =>
        structureTypes.includes(structure.structureType) &&
        structureUtils.isUpgraderStructure(structure),
    })
  },

  full(structure) {
    // console.log(structure)
    if (STORE_STRUCTURE_TYPES.includes(structure.structureType)) {
      return structure.store[RESOURCE_ENERGY] === structure.storeCapacity
    }
    return structure.energy === structure.energyCapacity
  },
}

module.exports = structureUtils
