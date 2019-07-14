const sourceIndex = 1
const targetTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER]

const chooseFlag = () => {
  const flags = Object.keys(Game.flags)
  const yellowFlags = flags.filter(flag => Game.flags[flag].color === 6)
  const flagName = yellowFlags[0]
  return Game.flags[flagName]
}

const targets = creep => {
  // room = Game.rooms
  homeRoom = Game.rooms[creep.memory.homeRoom]
  // console.log(room)
  return homeRoom.find(FIND_STRUCTURES, {
    filter: structure =>
      targetTypes.includes(structure.structureType) &&
      structure.energy < structure.energyCapacity,
  })
}

const chooseTarget = creep => {
  const sortedTargetsRange = targets(creep).sort(
    (a, b) => creep.pos.getRangeTo(a) > creep.pos.getRangeTo(b)
  )

  const filteredTargets = sortedTargetsRange.filter(
    target => target.structureType !== STRUCTURE_TOWER
  )

  if (filteredTargets.length > 0) {
    // console.log(`filteredTargets: ${filteredTargets}`);
    return filteredTargets[0]
  }

  // console.log(`chooseTarget: ${sortedTargetsRange[0]}`);
  return sortedTargetsRange[0]
}

const roleRemoteMiner = {
  run(creep) {
    if (!creep.memory.sourceId) {
      console.log('there is no sourceId in the memory')
      const flag = chooseFlag()
      creep.moveTo(flag.pos)
      if (creep.room === flag.room) {
        creep.memory.sourceId = flag.pos.findClosestByRange(FIND_SOURCES).id
      }
    }

    if (creep.memory.depositing && creep.carry.energy === 0) {
      console.log(`Stop Depositing`)
      creep.memory.depositing = false
      creep.say('🔄 harvest')
    }
    if (
      !creep.memory.depositing &&
      creep.carry.energy === creep.carryCapacity
    ) {
      console.log(`Start Depositing`)
      creep.memory.depositing = true
      creep.say('deposit')
    }

    if (creep.memory.depositing) {
      // console.log(`${creep.name} finding structures`)
      const target = chooseTarget(creep)
      if (target) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          // console.log(`moving to target: ${target}`);
          creep.moveTo(target, {
            visualizePathStyle: { stroke: '#ffffff' },
          })
        }
      }
    } else {
      // console.log(Game.rooms)
      const source = Game.getObjectById(creep.memory.sourceId)
      console.log(creep.memory.sourceId)
      // console.log(source)
      console.log(creep.harvest(source))
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        console.log('moving to source')
        creep.moveTo(source.pos, { visualizePathStyle: { stroke: '#ffaa00' } })
      } else {
        const flag = chooseFlag()
        creep.moveTo(flag.pos)
      }
    }
  },
}

module.exports = roleRemoteMiner
