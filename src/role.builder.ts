import pickup from './creep.pickup'
import structureUtils from './structure.utils'

const sourceIndex = 1

const chooseSourceBuilding = (creep: Creep) => {
  const sourceBuilding = creep.pos.findClosestByPath(
    structureUtils.energyStructures(creep.room, creep.carryCapacity)
  )

  // creep.memory.source = newSource.id
  return sourceBuilding
}

const chooseSource = (creep: Creep) => {
  const sources = creep.room.find(FIND_SOURCES)
  return sources[sourceIndex]
}

const findConstruction = (creep: Creep) =>
  creep.room.find(FIND_CONSTRUCTION_SITES)[0]

const setBuildingId = (creep: Creep) => {
  creep.memory.site = findConstruction(creep).id
  console.log(`builder setting target: ${creep.memory.target}`)
}

const doneHarvesting = (creep: Creep) =>
  !creep.memory.site && creep.carry.energy === creep.carryCapacity

const doneBuilding = (creep: Creep) =>
  creep.memory.site && creep.carry.energy === 0

const chooseSite = (creep: Creep): ConstructionSite => {
  if (Game.getObjectById(creep.memory.site)) {
    // @ts-ignore
    return Game.getObjectById(creep.memory.site)
  }
  return findConstruction(creep)
}

const roleBuilder = (creep: Creep) => {
  if (doneBuilding(creep)) {
    delete creep.memory.site
    creep.say('🔄 harvest')
  }

  if (doneHarvesting(creep)) {
    delete creep.memory.site
    setBuildingId(creep)
    creep.say('🚧 build')
  }

  if (creep.memory.site) {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES)
    const target = chooseSite(creep)
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
        // @ts-ignore
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
