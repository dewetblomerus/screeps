import structureUtils, {
  isStructureNearSource,
  destinationContainers,
} from './structure.utils'

const minEnergyToMove = 300

const storeTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE]
const supplyTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK]

const supplyStructurePriorities = [
  ['container', 10],
  ['link', 10],
  ['storage', 10],
]

const notEnoughInStorage = (room: Room) =>
  room.storage && room.storage.store[RESOURCE_ENERGY] < 50000

const prioritizeUpgrading = (room: Room) => {
  const upgraderStructure = structureUtils.upgraderStructures(room)[0]

  if (room.storage && upgraderStructure.structureType === STRUCTURE_LINK) {
    return (
      upgraderStructure.energy < 500 &&
      room.storage.store[RESOURCE_ENERGY] > 5000
    )
  }

  return false
}

const adjustPriority = (
  structureType: StructureConstant,
  priority: number,
  room: Room
): number => {
  if (room.storage && structureType === 'storage') {
    if (notEnoughInStorage(room)) {
      return priority - 1
    }

    if (prioritizeUpgrading(room)) {
      return priority + 1
    }
  }

  return priority
}

// @ts-ignore
const containsEnergy = structure => {
  if (storeTypes.includes(structure.structureType)) {
    return structure.store[RESOURCE_ENERGY]
  }
  return structure.energy
}

// @ts-ignore
const containsMinEnergy = structure =>
  containsEnergy(structure) > minEnergyToMove

const adjustedPriorities = (creep: Creep) => {
  return supplyStructurePriorities.map(([structureType, priority]) => [
    structureType,
    // @ts-ignore
    adjustPriority(structureType, priority, creep.room),
  ])
}

const supplyStructures = (creep: Creep) => {
  if (structureUtils.linkNearStorage(creep.room)) {
    // console.log('there is a supply link')
    // @ts-ignore
    if (structureUtils.linkNearStorage(creep.room).energy > minEnergyToMove) {
      // console.log('it has enough')
      return structureUtils.linkNearStorage(creep.room)
    }
  }

  return creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      // @ts-ignore
      supplyTypes.includes(structure.structureType) &&
      containsMinEnergy(structure) &&
      isStructureNearSource(structure),
  })
}

const anyStructures = (creep: Creep) =>
  creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      // @ts-ignore
      supplyTypes.includes(structure.structureType) &&
      containsMinEnergy(structure),
  })

const chooseStructureType = (creep: Creep) => {
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

const chooseSupply = (creep: Creep) => {
  const structureType = chooseStructureType(creep)
  if (structureType === STRUCTURE_STORAGE) {
    return creep.room.storage
  }

  if (structureType === STRUCTURE_CONTAINER) {
    return creep.pos.findClosestByRange(destinationContainers(creep.room))
  }

  return structureUtils.linkNearStorage(creep.room)
}

const getSupply = (creep: Creep) => chooseSupply(creep)

export default getSupply
