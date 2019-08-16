import { Role } from './config'

const bodyPriorities = {
  worker: [[WORK, 3], [CARRY, 1], [MOVE, 1]],
  carrier: [[CARRY, 2], [MOVE, 1]],
  harvester: [[WORK, 1], [CARRY, 1], [MOVE, 1]],
  upgrader: [[WORK, 3], [CARRY, 1], [MOVE, 1]],
  builder: [[WORK, 2], [CARRY, 1], [MOVE, 1]],
  remoteMiner: [[WORK, 1], [CARRY, 1], [MOVE, 1]],
  remoteCarrier: [[CARRY, 1], [MOVE, 1]],
}

const bodyBudgets = {
  worker: 800,
  carrier: 1000,
  harvester: 1000,
  upgrader: 1000,
  builder: 1000,
  remoteMiner: 200,
  remoteCarrier: 100,
}

const countCreepsInRoom = () => {
  const allCreeps = Object.keys(Game.creeps).length
  return allCreeps
}

const bodyPartCost = {
  work: 100,
  carry: 50,
  move: 50,
}

const bodyCost = (body: Array<BodyPartConstant>) =>
  // @ts-ignore
  body.reduce((prev, bodyPart) => prev + bodyPartCost[bodyPart], 0)

const bodyBudget = (room: Room) => {
  if (countCreepsInRoom() < 2) {
    if (room.energyAvailable > 300) {
      return room.energyAvailable
    }
    return 300
  }

  return room.energyCapacityAvailable
}

const upgraderBudget = (room: Room) => {
  if (room.find(FIND_CONSTRUCTION_SITES).length > 0) {
    return 200
  }

  if (room.storage) {
    const healthyBudget = room.storage.store[RESOURCE_ENERGY] - 10000
    if (healthyBudget > room.energyCapacityAvailable) {
      return room.energyCapacityAvailable
    }

    if (healthyBudget < 200) {
      return 200
    }

    return healthyBudget
  }

  if (bodyBudget(room) > bodyBudgets.upgrader) {
    return bodyBudgets.upgrader
  }

  return bodyBudget(room)
}

const realisticBudget = (room: Room, role: Role) => {
  if (role === 'upgrader') {
    return upgraderBudget(room)
  }

  if (bodyBudget(room) > bodyBudgets[role]) {
    return bodyBudgets[role]
  }

  return bodyBudget(room)
}

const countInBody = (
  body: Array<BodyPartConstant>,
  bodyPart: BodyPartConstant
) =>
  body.reduce((total, thisPart) => total + (thisPart === bodyPart ? 1 : 0), 0)

const adjustPriority = (
  body: Array<BodyPartConstant>,
  bodyPart: BodyPartConstant,
  priority: Number
) => {
  // @ts-ignore
  const normalizedPriority = priority * 10
  if (countInBody(body, bodyPart) === 0) {
    return normalizedPriority * 10
  }
  return normalizedPriority / countInBody(body, bodyPart)
}

const nextBodyPart = ({
  body,
  role,
}: {
  body: Array<BodyPartConstant>
  role: Role
}) => {
  const priorities = bodyPriorities[role]

  // @ts-ignore
  const currentPriorities = priorities.map(([bodyPart, priority]) => [
    bodyPart,
    adjustPriority(body, bodyPart, priority),
  ])

  // console.log(`currentPriorities: ${currentPriorities}`)

  // @ts-ignore
  const maxPriority = currentPriorities.reduce((max, priority) =>
    priority[1] > max[1] ? priority : max
  )[0]

  return maxPriority
}

const buildBody = (role: Role, room: Room) => {
  const budget = realisticBudget(room, role)
  const body: BodyPartConstant[] = []

  while (
    bodyCost([...body, nextBodyPart({ body, role })]) <= budget &&
    body.length < 50
  ) {
    body.push(nextBodyPart({ body, role }))
  }

  // console.log(body)

  return body
}

export default buildBody
