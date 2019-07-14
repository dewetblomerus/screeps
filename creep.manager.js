const roleHarvester = require('./role.harvester')
const roleUpgrader = require('./role.upgrader')
const roleBuilder = require('./role.builder')
const roleWorker = require('./role.worker')
const roleCarrier = require('./role.carrier')
const roleRemoteMiner = require('./role.remoteMiner')
const setHome = require('./creep.setHome')

const manageCreeps = () => {
  const creepsArray = Object.values(Game.creeps)
  for (const creep of creepsArray) {
    setHome(creep)

    if (creep.memory.role === 'harvester') {
      roleHarvester(creep)
    }
    if (creep.memory.role === 'upgrader') {
      roleUpgrader(creep)
    }
    if (creep.memory.role === 'builder') {
      roleBuilder(creep)
    }
    if (creep.memory.role === 'worker') {
      roleWorker(creep)
    }
    if (creep.memory.role === 'carrier') {
      roleCarrier(creep)
    }
    if (creep.memory.role === 'remoteMiner') {
      roleRemoteMiner(creep)
    }
  }
}

module.exports = manageCreeps
