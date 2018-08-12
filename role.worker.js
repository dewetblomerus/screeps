const targetTypes = [STRUCTURE_CONTAINER, STRUCTURE_LINK]
// const targetTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];

const chooseSource = creep => {
  const sourceFromMemory = Game.getObjectById(creep.memory.targetSource)
  // console.log(sourceFromMemory);
  if (creep.memory.targetSource) {
    // console.log(`source from memory: ${sourceFromMemory}`);
    return sourceFromMemory
  }

  const sources = creep.room.find(FIND_SOURCES)
  const targetedSources = Object.keys(Game.creeps).map(creepName =>
    Game.getObjectById(Game.creeps[creepName].memory.targetSource)
  )
  // console.log(`targetedSources: ${targetedSources}`);
  const untargetedSources = sources.filter(
    source => !targetedSources.includes(source)
  )
  // console.log(`untargeted: ${untargetedSources}`);
  return untargetedSources[0]
}

const setSource = creep => {
  const targetSource = chooseSource(creep).id
  creep.memory.targetSource = targetSource
}

const chooseTarget = creep =>
  creep.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: structure => targetTypes.includes(structure.structureType),
  })

const roleWorker = {
  run(creep) {
    if (creep.memory.depositing && creep.carry.energy === 0) {
      // console.log(`Worker Start Harvesting`);
      creep.memory.depositing = false
      setSource(creep)
      creep.say('🔄 harvest')
    }
    if (
      !creep.memory.depositing &&
      creep.carry.energy === creep.carryCapacity
    ) {
      // console.log(`Worker Start Depositing`);
      creep.memory.depositing = true
      creep.say('🔋 deposit')
    }

    if (creep.memory.depositing) {
      // console.log(`${creep.name} finding structures`)
      const target = chooseTarget(creep)
      if (target) {
        // console.log('there is a target');
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          // console.log(`Worker out of range: ${target}`)
          creep.moveTo(target, {
            visualizePathStyle: { stroke: '#ffffff' },
          })
          // console.log(result)
        }
      }
    } else {
      const source = chooseSource(creep)
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
      }
    }
  },
}

module.exports = roleWorker
