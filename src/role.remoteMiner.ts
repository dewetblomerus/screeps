const chooseFlag = (): Flag => {
  const flags = Object.keys(Game.flags)
  const yellowFlags = flags.filter(flag => Game.flags[flag].color === 6)
  const flagName = yellowFlags[0]
  return Game.flags[flagName]
}

const roleRemoteMiner = (creep: Creep) => {
  const flag = chooseFlag()
  if (!creep.memory.sourceId) {
    console.log('there is no sourceId in the memory')
    const range = creep.pos.getRangeTo(flag.pos)
    if (range > 1) {
      console.log('moving to flag')
      creep.moveTo(flag.pos)
      return
    }
  }

  // @ts-ignore
  creep.memory.sourceId = flag.pos.findClosestByRange(FIND_SOURCES).id

  if (creep.carry.energy === creep.carryCapacity) {
    creep.say('drop')
    for (const resourceType in creep.carry) {
      // @ts-ignore
      creep.drop(resourceType)
    }
  }

  const source = Game.getObjectById<Source>(creep.memory.sourceId)
  if (source) {
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source.pos, { visualizePathStyle: { stroke: '#ffaa00' } })
    }
  }
}

export default roleRemoteMiner
