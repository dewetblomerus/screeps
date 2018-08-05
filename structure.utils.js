SOURCE_STRUCTURE_TYPES = [STRUCTURE_CONTAINER, STRUCTURE_LINK]
UPGRADER_STRUCTURE_TYPES = [STRUCTURE_CONTAINER, STRUCTURE_LINK]
RESOURCE_STRUCTURE_TYPES = [
  STRUCTURE_CONTAINER,
  STRUCTURE_LINK,
  STRUCTURE_STORAGE,
]

STORE_STRUCTURE_TYPES = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE]

const structureUtils = {
  energyStructures(room, minEnergy = 50) {
    return room.find(FIND_MY_STRUCTURES, {
      filter: structure => {
        return (
          RESOURCE_STRUCTURE_TYPES.includes(structure.structureType) &&
          structureUtils.containsEnergy(structure) >= minEnergy
        )
      },
    })
  },

  containsEnergy(structure) {
    if (STORE_STRUCTURE_TYPES.includes(structure.structureType)) {
      return structure.store[RESOURCE_ENERGY]
    } else {
      return structure.energy
    }
  },

  isSourceStructure(structure) {
    if (SOURCE_STRUCTURE_TYPES.includes(structure.structureType)) {
      return structure.pos.findInRange(FIND_SOURCES, 2).length > 0
    }
  },

  isUpgraderStructure(structure) {
    if (UPGRADER_STRUCTURE_TYPES.includes(structure.structureType)) {
      return structure.pos.getRangeTo(structure.room.controller) < 5
    }
  },

  sourceStructures(room, structureTypes = SOURCE_STRUCTURE_TYPES) {
    return room.find(FIND_MY_STRUCTURES, {
      filter: structure => {
        return (
          structureTypes.includes(structure.structureType) &&
          structureUtils.isSourceStructure(structure)
        )
      },
    })
  },

  upgraderStructures(room, structureTypes = UPGRADER_STRUCTURE_TYPES) {
    return room.find(FIND_MY_STRUCTURES, {
      filter: structure => {
        return (
          structureTypes.includes(structure.structureType) &&
          structureUtils.isUpgraderStructure(structure)
        )
      },
    })
  },
}

module.exports = structureUtils
