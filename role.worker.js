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

const roleWorker = creep => {
  if (creep.carry.energy === creep.carryCapacity) {
    creep.say('🔄 drop')
    for (const resourceType in creep.carry) {
      creep.drop(resourceType)
    }
  } else {
    const source = chooseSource(creep)
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
    }
  }
}

module.exports = roleWorker
