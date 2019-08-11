const roleHarvester = require('./role.harvester')
const roleUpgrader = require('./role.upgrader')
import roleBuilder from './role.builder'
import roleWorker from './role.worker'
import roleCarrier from './role.carrier'
import roleRemoteMiner from './role.remoteMiner'
import roleRemoteCarrier from './role.remoteCarrier'
import setHome from './creep.setHome'

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
    if (creep.memory.role === 'remoteCarrier') {
      roleRemoteCarrier(creep)
    }
  }
}

export default manageCreeps
