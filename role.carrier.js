const minEnergyToMove = 300
const targetPriorities = {
  extension: { slug: STRUCTURE_EXTENSION, priority: 0 },
  spawn: { slug: STRUCTURE_SPAWN, priority: 1 },
  tower: { slug: STRUCTURE_TOWER, priority: 2 },
  // container: { slug: 'sourceContainer', priority: 4 },
  link: { slug: STRUCTURE_LINK, priority: 4 },
  storage: { slug: STRUCTURE_STORAGE, priority: 5 },
  container: { slug: STRUCTURE_CONTAINER, priority: 6 },
}

const targetTypes = [
  STRUCTURE_EXTENSION,
  STRUCTURE_SPAWN,
  STRUCTURE_TOWER,
  STRUCTURE_STORAGE,
  STRUCTURE_LINK,
]
const sourceTypes = [STRUCTURE_CONTAINER]

const sources = creep => {
  return creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        sourceTypes.includes(structure.structureType) &&
        structure.store[RESOURCE_ENERGY] > minEnergyToMove
      )
    },
  })
}

const getSource = creep => {
  const newSource = sources(creep).sort((a, b) => {
    return creep.pos.getRangeTo(a) > creep.pos.getRangeTo(b)
  })[0]

  // creep.memory.source = newSource.id
  return newSource
}

const chooseStructureType = creep => {
  structures = targetsNeedingEnergy(creep)
  structureTypesNeedingEnergy = structures.map(
    structure => structure.structureType
  )
  // console.log(structureTypesNeedingEnergy);
  if (structureTypesNeedingEnergy.length > 0) {
    // console.log('there are targets');
    const structureType = structureTypesNeedingEnergy.reduce((a, b) => {
      return targetPriorities[a].priority < targetPriorities[b].priority ? a : b
    })

    // console.log(`prioritized structureType: ${structureType}`);
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
  setTarget(creep)
  return Game.getObjectById(creep.memory.target)
}

const setTarget = creep => {
  if (creep.memory.target) {
    target = Game.getObjectById(creep.memory.target)
  }

  if (target.energy < target.energyCapacity) {
    return
  }

  if (chooseTarget(creep)) {
    creep.memory.target = chooseTarget(creep).id
  }
}

const chooseTarget = creep => {
  const structureType = chooseStructureType(creep)

  if (structureType == STRUCTURE_STORAGE) {
    return creep.room.storage
  }

  sortedTargetsRange = structuresOfType(creep, structureType).sort((a, b) => {
    return creep.pos.getRangeTo(a) > creep.pos.getRangeTo(b)
  })

  console.log(`chooseTarget: ${sortedTargetsRange.length}`)
  const newTarget = sortedTargetsRange[0]
  return newTarget
}

const targetsNeedingEnergy = creep => {
  return creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        targetTypes.includes(structure.structureType) &&
        structure.energy < structure.energyCapacity
      )
    },
  })
}

const deposit = creep => {
  // console.log(`${creep.name} finding structures`);
  let target = getTarget(creep)
  // console.log(`Depositing: ${target}`);
  if (target) {
    // console.log('there is a target');
    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      // console.log(`moving to target: ${target}`);
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
      console.log(`Carrier start Collecting`)
      creep.memory.depositing = false
      creep.say('🔄 collect')
    }

    if (!creep.memory.depositing && creep.carry.energy == creep.carryCapacity) {
      console.log(`Carrier start Depositing`)
      creep.memory.depositing = true
      // console.log(chooseTarget(creep).id);
      creep.memory.target = chooseTarget(creep).id
      creep.say('deposit')
    }

    if (creep.memory.depositing) {
      deposit(creep)
    } else {
      const source = getSource(creep)
      // console.log(source);
      if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        // console.log('not in range');
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
      }
    }
  },
}

module.exports = roleCarrier
