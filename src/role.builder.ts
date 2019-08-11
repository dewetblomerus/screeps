import pickup from './creep.pickup'
import structureUtils from './structure.utils'

const sourceIndex = 1

const chooseSourceBuilding = creep => {
  const sourceBuilding = creep.pos.findClosestByPath(
    structureUtils.energyStructures(creep.room, creep.carryCapacity)
  )

  // creep.memory.source = newSource.id
  return sourceBuilding
}

const chooseSource = creep => {
  const sources = creep.room.find(FIND_SOURCES)
  return sources[sourceIndex]
}

const findConstruction = creep => creep.room.find(FIND_CONSTRUCTION_SITES)[0]

const setTargetId = creep => {
  creep.memory.target = findConstruction(creep).id
  console.log(`builder setting target: ${creep.memory.target}`)
}

const doneHarvesting = creep =>
  !creep.memory.building && creep.carry.energy === creep.carryCapacity

const doneBuilding = creep => creep.memory.building && creep.carry.energy === 0

const chooseSite = creep => {
  if (Game.getObjectById(creep.memory.target)) {
    return Game.getObjectById(creep.memory.target)
  }
  return findConstruction(creep)
}

const roleBuilder = creep => {
  if (doneBuilding(creep)) {
    creep.memory.building = false
    creep.say('🔄 harvest')
  }

  if (doneHarvesting(creep)) {
    creep.memory.building = true
    // creep.memory.target = findConstruction.id
    setTargetId(creep)
    creep.say('🚧 build')
  }

  if (creep.memory.building) {
    // console.log(`${target.progress}/${target.progressTotal}`);
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES)
    const target = chooseSite(creep)
    // console.log(`in progress: ${target}`);
    // console.log(`builder target: ${creep.memory.target}`);
    if (targets.length) {
      if (creep.build(target) === ERR_NOT_IN_RANGE) {
        // target building code
        creep.moveTo(target, {
          // maxRooms: 1,
          visualizePathStyle: { stroke: '#ffffff' },
        })
        // normal code
        // creep.moveTo(targets[0], {
        //   visualizePathStyle: { stroke: '#ffffff' }
        // });
      }
    }
  } else {
    const sourceBuilding = chooseSourceBuilding(creep)
    // if (creep.room.storage) {
    if (sourceBuilding) {
      // const source = getSource(creep)
      // console.log(source);
      if (
        creep.withdraw(sourceBuilding, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE
      ) {
        // console.log('not in range');
        creep.moveTo(sourceBuilding, {
          visualizePathStyle: { stroke: '#ffaa00' },
        })
      }
    } else {
      pickup(creep)
      const source = chooseSource(creep)
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
      }
    }
  }
}

export default roleBuilder
