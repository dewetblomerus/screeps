const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleBuilder = require('role.builder')
const roleWorker = require('role.worker')
const roleCarrier = require('role.carrier')

const creepManager = {
  run() {
    for (const name in Game.creeps) {
      const creep = Game.creeps[name]
      if (creep.memory.role == 'harvester') {
        roleHarvester.run(creep)
      }
      if (creep.memory.role == 'upgrader') {
        roleUpgrader.run(creep)
      }
      if (creep.memory.role == 'builder') {
        roleBuilder.run(creep)
      }
      if (creep.memory.role == 'worker') {
        roleWorker.run(creep)
      }
      if (creep.memory.role == 'carrier') {
        roleCarrier.run(creep)
      }
    }
  },
}

module.exports = creepManager
