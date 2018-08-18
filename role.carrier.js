const getSource = require('./creep.getSource')
const getTarget = require('./creep.getTarget')

const deposit = creep => {
  // console.log('carrier inside deposit')
  const target = getTarget(creep)
  // console.log(`carrier target: ${target}`)
  if (target) {
    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {
        visualizePathStyle: { stroke: '#ffffff' },
      })
    }
  }
}

const roleCarrier = {
  run(creep) {
    if (creep.memory.depositing && creep.carry.energy === 0) {
      creep.memory.depositing = false
      creep.say('🔄 collect')
    }

    if (
      !creep.memory.depositing &&
      creep.carry.energy === creep.carryCapacity
    ) {
      creep.memory.depositing = true
      creep.memory.target = getTarget(creep)
      creep.say('deposit')
    }

    if (creep.memory.depositing) {
      deposit(creep)
    } else {
      const source = getSource(creep)
      if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
      }
    }
  },
}

module.exports = roleCarrier
