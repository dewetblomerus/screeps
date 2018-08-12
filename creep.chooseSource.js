const structureUtils = require('structure.utils')

const minEnergyToMove = 300

const storeTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE]
const sourceTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK]

const containsMinEnergy = structure => {
  return containsEnergy(structure) > minEnergyToMove
}

const containsEnergy = structure => {
  if (storeTypes.includes(structure.structureType)) {
    return structure.store[RESOURCE_ENERGY]
  } else {
    return structure.energy
  }
}

const sourceStructures = creep => {
  return creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        sourceTypes.includes(structure.structureType) &&
        containsMinEnergy(structure) &&
        structureUtils.isSourceStructure(structure)
      )
    },
  })
}

const chooseSource = creep => {
  // console.log(`allSourceStructures ${sourceStructures(creep)}`)
  const newSource = creep.pos.findClosestByRange(sourceStructures(creep))
  // console.log(`newSource: ${newSource}`)

  if (newSource) {
    creep.memory.source = newSource.id
  }
  return newSource
}

const chooseStructureType = creep => {
  structures = targetsNeedingEnergy(creep)
  // console.log(`needsEnergy: ${structures}`)
  structureTypesNeedingEnergy = structures.map(
    structure => structure.structureType
  )
  // console.log(`types: ${structureTypesNeedingEnergy}`)
  // console.log(structureTypesNeedingEnergy);
  if (structureTypesNeedingEnergy.length > 0) {
    // console.log('there are targets');
    const structureType = structureTypesNeedingEnergy.reduce((a, b) => {
      return targetPriorities[a].priority < targetPriorities[b].priority ? a : b
    })

    // console.log(`prioritized structureType: ${structureType}`)
    return structureType
  }
  return STRUCTURE_STORAGE
}

const structuresOfType = (creep, structureType) => {
  return creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        structure.structureType == structureType &&
        structure.energy < structure.energyCapacity
      )
    },
  })
}

const getTarget = creep => {
  if (creep.memory.target) {
    // console.log('it already has a target')
    target = Game.getObjectById(creep.memory.target)
    // console.log(`target: ${target}`)
  }

  if (structureFull(target)) {
    // console.log('the target it already had is full')
    if (chooseTarget(creep)) {
      // console.log('a new target was chosen')
      creep.memory.target = chooseTarget(creep).id
      // console.log(Game.getObjectById(creep.memory.target))
    }
  }

  return Game.getObjectById(creep.memory.target)
}

const structureFull = structure => {
  // console.log(structure)
  if (storeTypes.includes(structure.structureType)) {
    return structure.store[RESOURCE_ENERGY] === structure.storeCapacity
  }
  return structure.energy === structure.energyCapacity
}

const targetsNeedingEnergy = creep => {
  return creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        targetTypes.includes(structure.structureType) &&
        !structureFull(structure)
      )
    },
  })
}

module.exports = chooseSource
