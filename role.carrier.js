const chooseSource = require('./creep.chooseSource')
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

const roleCarrier = {
  run(creep) {
    if (creep.memory.depositing && creep.carry.energy === 0) {
      // console.log(`Carrier start Collecting`)
      creep.memory.depositing = false
      creep.say('🔄 collect')
    }

    if (
      !creep.memory.depositing &&
      creep.carry.energy === creep.carryCapacity
    ) {
      // console.log(`Carrier start Depositing`)
      creep.memory.depositing = true
      creep.memory.target = getTarget(creep)
      creep.say('deposit')
    }

    if (creep.memory.depositing) {
      deposit(creep)
    } else {
      const source = chooseSource(creep)
      // console.log(source);
      if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        // console.log('not in range');
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
      }
    }
  },
}

module.exports = roleCarrier
