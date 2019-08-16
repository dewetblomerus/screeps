const chooseSource = (creep: Creep): Source => {
  const sourceFromMemory = Game.getObjectById<Source>(creep.memory.targetSource)
  if (sourceFromMemory) {
    return sourceFromMemory
  }

  console.log('The worker has no source in memory')

  const sources = creep.room.find(FIND_SOURCES)
  const targetedSources = Object.keys(Game.creeps)
    .map(creepName =>
      Game.getObjectById(Game.creeps[creepName].memory.targetSource)
    )
    .filter(source => source !== null)

  const untargetedSources = sources.filter(
    source => !targetedSources.includes(source)
  )
  console.log(`untargeted: ${untargetedSources}`)
  creep.memory.targetSource = untargetedSources[0].id
  return untargetedSources[0]
}

const roleWorker = (creep: Creep) => {
  if (creep.carry.energy === creep.carryCapacity) {
    creep.say('🔄 drop')
    for (const resourceType in creep.carry) {
      // @ts-ignore
      creep.drop(resourceType)
    }
  } else {
    const source = chooseSource(creep)
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
    }
  }
}

export default roleWorker
