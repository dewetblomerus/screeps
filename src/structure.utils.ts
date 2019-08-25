import { StructureStoringEnergy } from 'config'

const SOURCE_STRUCTURE_TYPES: StructureConstant[] = [
  STRUCTURE_CONTAINER,
  STRUCTURE_LINK,
]
const UPGRADER_STRUCTURE_TYPES: StructureConstant[] = [
  STRUCTURE_CONTAINER,
  STRUCTURE_LINK,
]
const RESOURCE_STRUCTURE_TYPES: StructureConstant[] = [
  STRUCTURE_CONTAINER,
  STRUCTURE_LINK,
  STRUCTURE_STORAGE,
]
const STORE_STRUCTURE_TYPES: StructureConstant[] = [
  STRUCTURE_CONTAINER,
  STRUCTURE_STORAGE,
]

export const isStructureNearSource = (structure: Structure): boolean => {
  if (SOURCE_STRUCTURE_TYPES.includes(structure.structureType)) {
    return structure.pos.findInRange(FIND_SOURCES, 2).length > 0
  }
  return false
}

const structureUtils = {
  destinationContainers(room: Room) {
    return room.find(FIND_STRUCTURES, {
      filter: s =>
        s.structureType === STRUCTURE_CONTAINER &&
        s.pos.findInRange(FIND_SOURCES, 2).length === 0,
    })
  },

  energyStructures(room: Room, minEnergy = 50) {
    return room.find(FIND_MY_STRUCTURES, {
      filter: structure =>
        RESOURCE_STRUCTURE_TYPES.includes(structure.structureType) &&
        // @ts-ignore
        structureUtils.containsEnergy(structure) >= minEnergy,
    })
  },

  containsEnergy(structure: StructureStoringEnergy) {
    if (STORE_STRUCTURE_TYPES.includes(structure.structureType)) {
      // @ts-ignore
      return structure.store[RESOURCE_ENERGY]
    }
    // @ts-ignore
    return structure.energy
  },

  isUpgraderStructure(structure: Structure) {
    if (UPGRADER_STRUCTURE_TYPES.includes(structure.structureType)) {
      // @ts-ignore
      return structure.pos.getRangeTo(structure.room.controller) < 5
    }
    return false
  },

  sourceStructures(room: Room, structureTypes = SOURCE_STRUCTURE_TYPES) {
    return room.find(FIND_MY_STRUCTURES, {
      filter: structure =>
        structureTypes.includes(structure.structureType) &&
        isStructureNearSource(structure),
    })
  },

  linkNearStorage(room: Room) {
    if (!room.storage) {
      return null
    }
    return room.find(FIND_MY_STRUCTURES, {
      filter: structure =>
        structure.structureType === STRUCTURE_LINK &&
        // @ts-ignore
        structure.pos.inRangeTo(structure.room.storage, 2),
    })[0]
  },

  upgraderStructures(room: Room, structureTypes = UPGRADER_STRUCTURE_TYPES) {
    return room.find(FIND_MY_STRUCTURES, {
      filter: structure =>
        structureTypes.includes(structure.structureType) &&
        structureUtils.isUpgraderStructure(structure),
    })
  },

  full(structure: Structure) {
    if (STORE_STRUCTURE_TYPES.includes(structure.structureType)) {
      // @ts-ignore
      return structure.store[RESOURCE_ENERGY] === structure.storeCapacity
    }
    // @ts-ignore
    return structure.energy === structure.energyCapacity
  },
}

export default structureUtils
