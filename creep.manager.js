const roleHarvester = require('./role.harvester')
const roleUpgrader = require('./role.upgrader')
const roleBuilder = require('./role.builder')
const roleWorker = require('./role.worker')
const roleCarrier = require('./role.carrier')
const roleRemoteMiner = require('./role.remoteMiner')

const manageCreeps = () => {
  const creepsArray = Object.values(Game.creeps)
  for (const creep of creepsArray) {
    if (creep.memory.role === 'harvester') {
      roleHarvester.run(creep)
    }
    if (creep.memory.role === 'upgrader') {
      roleUpgrader.run(creep)
    }
    if (creep.memory.role === 'builder') {
      roleBuilder.run(creep)
    }
    if (creep.memory.role === 'worker') {
      roleWorker.run(creep)
    }
    if (creep.memory.role === 'carrier') {
      roleCarrier.run(creep)
    }
    if (creep.memory.role === 'remoteMiner') {
      roleRemoteMiner.run(creep)
    }
  }
}

module.exports = manageCreeps
