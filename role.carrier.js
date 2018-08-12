const chooseSource = require('creep.chooseSource')

const targetPriorities = {
  extension: { slug: STRUCTURE_EXTENSION, priority: 0 },
  spawn: { slug: STRUCTURE_SPAWN, priority: 1 },
  tower: { slug: STRUCTURE_TOWER, priority: 2 },
  // container: { slug: 'sourceContainer', priority: 4 },
  link: { slug: STRUCTURE_LINK, priority: 4 },
  container: { slug: STRUCTURE_CONTAINER, priority: 5 },
  storage: { slug: STRUCTURE_STORAGE, priority: 6 },
}

const targetTypes = [
  STRUCTURE_EXTENSION,
  STRUCTURE_SPAWN,
  STRUCTURE_TOWER,
  STRUCTURE_STORAGE,
  STRUCTURE_CONTAINER,
]
const storeTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE]

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

const destinationContainers = room => {
  return room.find(FIND_STRUCTURES, {
    filter: s =>
      s.structureType === STRUCTURE_CONTAINER &&
      s.pos.findInRange(FIND_SOURCES, 2).length === 0,
  })
}

const chooseTarget = creep => {
  const structureType = chooseStructureType(creep)
  // console.log(`chosenStructureType: ${structureType}`)
  if (structureType == STRUCTURE_STORAGE) {
    return creep.room.storage
  }

  if (structureType == STRUCTURE_CONTAINER) {
    // console.log('target is a container')
    return creep.pos.findClosestByRange(destinationContainers(creep.room))
  }

  sortedTargetsRange = structuresOfType(creep, structureType).sort((a, b) => {
    return creep.pos.getRangeTo(a) > creep.pos.getRangeTo(b)
  })

  const newTarget = sortedTargetsRange[0]
  return newTarget
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

const deposit = creep => {
  let target = getTarget(creep)
  if (target) {
    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      const result = creep.moveTo(target, {
        visualizePathStyle: { stroke: '#ffffff' },
      })
      // console.log(result);
    }
  }
}

var roleCarrier = {
  run(creep) {
    if (creep.memory.depositing && creep.carry.energy == 0) {
      // console.log(`Carrier start Collecting`)
      creep.memory.depositing = false
      creep.say('🔄 collect')
    }

    if (!creep.memory.depositing && creep.carry.energy == creep.carryCapacity) {
      // console.log(`Carrier start Depositing`)
      creep.memory.depositing = true
      creep.memory.target = chooseTarget(creep).id
      creep.say('deposit')
    }

    if (creep.memory.depositing) {
      deposit(creep)
    } else {
      const source = chooseSource(creep)
      // console.log(source);
      if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        // console.log('not in range');
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
      }
    }
  },
}

module.exports = roleCarrier
