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

const bodyBudget = () => {
  if (countCreepsInRoom() < 4) {
    return Game.spawns['Spawn1'].room.energyAvailable
  }

  return Game.spawns['Spawn1'].room.energyCapacityAvailable
}

const buildBody = priorityBody => {
  console.log(`bodyBudget(): ${bodyBudget()}`)
  let body = priorityBody
  const realisticBudget = () => {
    if (bodyBudget() > 2000) {
      return 2000
    } else {
      return bodyBudget()
    }
  }

  const budget = realisticBudget(bodyBudget())
  console.log(`realisticBudget: ${budget}`)

  while (bodyCost(body) + bodyCost(priorityBody) <= budget) {
    body = [...body, ...priorityBody]
  }

  for (part of priorityBody) {
    if (bodyCost(body) + bodyPartCost[part] <= budget) {
      body = [...body, part]
    }
  }
  console.log(`body: ${body}`)
  return body
}

module.exports = buildBody
