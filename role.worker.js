const targetTypes = [STRUCTURE_CONTAINER]
// const targetTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];

const setSource = creep => {
  const targetSource = chooseSource(creep).id
  creep.memory.targetSource = targetSource
}

const chooseSource = creep => {
  const sourceFromMemory = Game.getObjectById(creep.memory.targetSource)
  // console.log(sourceFromMemory);
  if (creep.memory.targetSource) {
    // console.log(`source from memory: ${sourceFromMemory}`);
    return sourceFromMemory
  }

  const sources = creep.room.find(FIND_SOURCES)
  let creeps = Game.creeps
  // console.log(creeps);
  for (const name in Game.creeps) {
    const creep = Game.creeps[name]
    // console.log(creep);
  }
  const targetedSources = Object.keys(Game.creeps).map(creepName =>
    Game.getObjectById(Game.creeps[creepName].memory.targetSource)
  )
  // console.log(`targetedSources: ${targetedSources}`);
  untargetedSources = sources.filter(source => {
    return !targetedSources.includes(source)
  })
  // console.log(`untargeted: ${untargetedSources}`);
  return untargetedSources[0]
}

const chooseDestination = creep => {
  // console.log(targets(creep));
  const sortedTargetsRange = targets(creep).sort((a, b) => {
    return creep.pos.getRangeTo(a) > creep.pos.getRangeTo(b)
  })

  // console.log(`chooseDestination: ${sortedTargetsRange[0]}`);
  return sortedTargetsRange[0]
}

const targets = creep => {
  return creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return targetTypes.includes(structure.structureType)
    },
  })
}

var roleWorker = {
  run(creep) {
    if (creep.memory.depositing && creep.carry.energy == 0) {
      // console.log(`Worker Start Harvesting`);
      creep.memory.depositing = false
      setSource(creep)
      creep.say('🔄 harvest')
    }
    if (!creep.memory.depositing && creep.carry.energy == creep.carryCapacity) {
      // console.log(`Worker Start Depositing`);
      creep.memory.depositing = true
      creep.say('🔋 deposit')
    }

    if (creep.memory.depositing) {
      // console.log(`${creep.name} finding structures`);
      let destination = chooseDestination(creep)
      if (destination) {
        // console.log('there is a target');
        if (creep.transfer(destination, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          console.log(`Worker out of range: ${target}`)
          const result = creep.moveTo(destination, {
            visualizePathStyle: { stroke: '#ffffff' },
          })
          console.log(result)
        }
      }
    } else {
      const source = chooseSource(creep)
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
      }
    }
  },
}

module.exports = roleWorker
