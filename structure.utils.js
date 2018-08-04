SOURCE_STRUCTURE_TYPES = [STRUCTURE_CONTAINER, STRUCTURE_LINK]
UPGRADER_STRUCTURE_TYPES = [STRUCTURE_CONTAINER, STRUCTURE_LINK]

const structureUtils = {
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
