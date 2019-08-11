import getSupply from './creep.getSupply'
import getTarget from './creep.getTarget'

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

const collect = creep => {
  const dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES)
  if (dropped) {
    if (dropped.amount > 300) {
      // console.log('there is more than 300')
      if (dropped) {
        if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
          creep.moveTo(dropped)
        }
        return
      }
    }
  }

  const supply = getSupply(creep)
  if (creep.withdraw(supply, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(supply, { visualizePathStyle: { stroke: '#ffaa00' } })
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
    collect(creep)
  }
}

export default roleCarrier
