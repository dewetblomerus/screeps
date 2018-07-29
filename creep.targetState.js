const workerBody = [WORK, WORK, WORK, CARRY, MOVE]

const balancedBody = [WORK, CARRY, MOVE]

const carrierBody = [CARRY, MOVE]

const startingOut = (energyCapacity, creepsCount) => {
  return energyCapacity === 300 || creepsCount < 2
}

const targetState = () => {
  let state = {}

  const energyCapacity = Game.spawns['Spawn1'].room.energyCapacityAvailable
  if (startingOut(energyCapacity, 2)) {
    return {
      harvester: { amount: 4, body: balancedBody, priority: 0 },
      upgrader: { amount: 3, body: balancedBody, priority: 1 },
    }
  }

  return {
    upgrader: { amount: 5, body: balancedBody, priority: 1 },
    worker: { amount: 0, body: workerBody, priority: 3 },
    carrier: { amount: 0, body: carrierBody, priority: 2 },
    builder: { amount: 0, body: balancedBody, priority: 4 },
  }
}

module.exports = targetState
