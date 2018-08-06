const bodyPriorities = {
  worker: [[WORK, 3], [CARRY, 1], [MOVE, 1]],
  carrier: [[CARRY, 1], [MOVE, 1]],
  harvester: [[WORK, 1], [CARRY, 1], [MOVE, 1]],
  upgrader: [[WORK, 3], [CARRY, 1], [MOVE, 1]],
  builder: [[WORK, 2], [CARRY, 1], [MOVE, 1]],
}

const bodyBudgets = {
  worker: 800,
  carrier: 1000,
  harvester: 1000,
  upgrader: 2000,
  builder: 1000,
}

const countCreepsInRoom = () => {
  const all = true
  var allCreeps = _.filter(Game.creeps, function(all) {
    return all
  }).length

  return allCreeps
}

const bodyPartCost = {
  work: 100,
  carry: 50,
  move: 50,
}

const bodyCost = body => {
  return body.reduce((prev, bodyPart) => prev + bodyPartCost[bodyPart], 0)
}

const bodyBudget = room => {
  if (countCreepsInRoom() < 2) {
    return room.energyAvailable
  }

  return room.energyCapacityAvailable
}

const realisticBudget = (room, role) => {
  if (bodyBudget(room) > bodyBudgets[role]) {
    return bodyBudgets[role]
  } else {
    return bodyBudget(room)
  }
}

const countInBody = (body, bodyPart) => {
  return body.reduce(
    (total, thisPart) => total + (thisPart === bodyPart ? 1 : 0),
    0
  )
}

const adjustPriority = (body, bodyPart, priority) => {
  normalizedPriority = priority * 10
  if (countInBody(body, bodyPart) === 0) {
    return normalizedPriority
  }
  return normalizedPriority / countInBody(body, bodyPart)
}

const nextBodyPart = ({ body, role, room }) => {
  priorities = bodyPriorities[role]

  const currentPriorities = priorities.map(([bodyPart, priority]) => {
    return [bodyPart, adjustPriority(body, bodyPart, priority)]
  })

  console.log(`currentPriorities: ${currentPriorities}`)

  maxPriority = currentPriorities.reduce(
    (max, priority) => (priority[1] > max[1] ? priority : max)
  )[0]

  return maxPriority
}

const buildBody = (role, room) => {
  const budget = realisticBudget(room, role)
  let body = []

  while (
    bodyCost([...body, nextBodyPart({ body: body, role: role, room: room })]) <=
      budget &&
    body.length < 50
  ) {
    body.push(nextBodyPart({ body: body, role: role, room: room }))
  }

  console.log(body)

  return body
}

module.exports = buildBody
