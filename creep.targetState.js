const workerBody = [WORK, WORK, WORK, CARRY, MOVE]

const balancedBody = [WORK, CARRY, MOVE]

const carrierBody = [CARRY, MOVE]

const targetState = {
  harvester: { amount: 4, body: balancedBody, priority: 0 },
  upgrader: { amount: 5, body: balancedBody, priority: 1 },
  worker: { amount: 0, body: workerBody, priority: 3 },
  carrier: { amount: 0, body: carrierBody, priority: 2 },
  builder: { amount: 0, body: balancedBody, priority: 4 },
}

module.exports = targetState
