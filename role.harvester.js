const pickup = require('./creep.pickup')

const sourceIndex = 1
const targetTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER]

const chooseSource = creep => {
  const sources = creep.room.find(FIND_SOURCES)
  return sources[sourceIndex]
}

const targets = creep =>
  creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      targetTypes.includes(structure.structureType) &&
      structure.energy < structure.energyCapacity,
  })

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

const roleHarvester = creep => {
  if (creep.memory.depositing && creep.carry.energy === 0) {
    // console.log(`Stop Depositing`)
    creep.memory.depositing = false
    creep.say('🔄 harvest')
  }
  if (!creep.memory.depositing && creep.carry.energy === creep.carryCapacity) {
    // console.log(`Start Depositing`)
    creep.memory.depositing = true
    creep.say('deposit')
  }

  if (creep.memory.depositing) {
    // console.log(`${creep.name} finding structures`);
    const target = chooseTarget(creep)
    if (target) {
      // console.log('there is a target');
      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        // console.log(`moving to target: ${target}`);
        creep.moveTo(target, {
          visualizePathStyle: { stroke: '#ffffff' },
        })
      }
    }
  } else {
    pickup(creep)
    const source = chooseSource(creep)
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
    }
  }
}

module.exports = roleHarvester
