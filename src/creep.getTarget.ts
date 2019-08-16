import structureUtils from './structure.utils'

type PriorityStructure = [StructureConstant, number]

const targetPriorities: PriorityStructure[] = [
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

const enoughStorage = (room: Room) => {
  if (room.storage) {
    return room.storage.store[RESOURCE_ENERGY] > 20000
  }
  return false
}

const adjustPriority = (
  structureType: StructureConstant,
  priority: number,
  room: Room
): number => {
  if (structureType === 'storage') {
    if (!enoughStorage(room)) {
      return 4
    }
  }

  return priority
}

const adjustedPriorities = (room: Room): PriorityStructure[] => {
  return targetPriorities.map<PriorityStructure>(
    ([structureType, priority]) => [
      structureType,
      adjustPriority(structureType, priority, room),
    ]
  )
}

const targetsNeedingEnergy = (room: Room) =>
  room.find(FIND_STRUCTURES, {
    filter: structure =>
      // @ts-ignore
      targetTypes.includes(structure.structureType) &&
      !structureUtils.full(structure),
  })

const chooseStructureType = (room: Room) => {
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

  if (room.storage) {
    // console.log('returning Storage')
    return STRUCTURE_STORAGE
  }

  // console.log('returning Spawn')
  return STRUCTURE_SPAWN
}

const structuresOfType = (
  room: Room,
  structureType: StructureStorage | StructureContainer
) =>
  room.find(FIND_STRUCTURES, {
    filter: structure =>
      // @ts-ignore
      structure.structureType === structureType &&
      // @ts-ignore
      structure.energy < structure.energyCapacity,
  })

const destinationContainers = (room: Room) =>
  room.find(FIND_STRUCTURES, {
    filter: s =>
      s.structureType === STRUCTURE_CONTAINER &&
      s.pos.findInRange(FIND_SOURCES, 2).length === 0,
  })

const chooseTarget = (creep: Creep, room: Room) => {
  const structureType = chooseStructureType(room)
  if (structureType === STRUCTURE_STORAGE) {
    return room.storage
  }

  if (structureType === STRUCTURE_CONTAINER) {
    return creep.pos.findClosestByRange(destinationContainers(room))
  }

  // @ts-ignore
  const potentialTargets = structuresOfType(room, structureType)
  const newTarget = creep.pos.findClosestByRange(potentialTargets)
  return newTarget
}

const getTarget = (creep: Creep): StructureStorage => {
  // console.log('getTarget')
  if (creep.memory.target) {
    // const target = Game.getObjectById(creep.memory.target)
    // console.log(`target: ${target}`)
  }

  // @ts-ignore
  const homeRoom = Game.rooms[creep.memory.homeRoom]
  const chosenTarget = chooseTarget(creep, homeRoom)
  if (chosenTarget) {
    creep.memory.target = chosenTarget.id
  }

  // @ts-ignore
  return Game.getObjectById(creep.memory.target)
}

export default getTarget
