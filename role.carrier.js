const getSupply = require('./creep.getSupply')
const getTarget = require('./creep.getTarget')

const deposit = creep => {
  const target = getTarget(creep)
  if (target) {
    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {
        visualizePathStyle: { stroke: '#ffffff' },
      })
    }
  }
}

const roleCarrier = creep => {
  if (creep.memory.depositing && creep.carry.energy === 0) {
    creep.memory.depositing = false
    creep.say('🔄 collect')
  }

  if (!creep.memory.depositing && creep.carry.energy === creep.carryCapacity) {
    creep.memory.depositing = true
    creep.memory.target = getTarget(creep)
    creep.say('deposit')
  }

  if (creep.memory.depositing) {
    deposit(creep)
  } else {
    const dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES)
    if (dropped.amount > 300) {
      // console.log('there is more than 300')
      if (dropped) {
        if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
          creep.moveTo(dropped)
        }
      }
    } else {
      const supply = getSupply(creep)
      if (creep.withdraw(supply, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(supply, { visualizePathStyle: { stroke: '#ffaa00' } })
      }
    }
  }
}

module.exports = roleCarrier
