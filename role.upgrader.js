const sourceIndex = 1
const sourceStructureTypes = [
  STRUCTURE_CONTAINER,
  STRUCTURE_STORAGE,
  STRUCTURE_LINK,
]

const chooseSource = creep => {
  const sources = creep.room.find(FIND_SOURCES)
  return sources[sourceIndex]
}

const assignSourceStructure = creep => {
  sourceStructures = creep.room.find(FIND_STRUCTURES, {
    filter: s => sourceStructureTypes.includes(s.structureType),
  })

  closeSourceStructures = creep.room.controller.pos.findInRange(
    sourceStructures,
    10
  )

  closest = creep.room.controller.pos.findClosestByRange(closeSourceStructures)

  if (closest) {
    creep.memory.sourceStructure = closest.id
  }
}

var roleUpgrader = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (!creep.memory.sourceStructure) {
      console.log('I have no sourceStructure')
      assignSourceStructure(creep)
    }
    if (creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false
      // console.log(`${creep.name} is now harvesting`);
      creep.say('🔄 withdraw')
    }
    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true
      creep.memory.target = creep.room.controller.id
      // console.log(`${creep.name} is now upgrading`);
      creep.say('⚡ upgrade')
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        // console.log(`${creep.name} is now moving to the controller`);
        let target = Game.getObjectById(creep.memory.target)
        creep.moveTo(target, {
          // maxRooms: 1,
          visualizePathStyle: { stroke: '#ffffff' },
        })
      }
    } else {
      if (Game.getObjectById(creep.memory.sourceStructure)) {
        sourceStructure = Game.getObjectById(creep.memory.sourceStructure)
        if (
          creep.withdraw(sourceStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          // console.log('not in range');
          creep.moveTo(sourceStructure, {
            visualizePathStyle: { stroke: '#ffaa00' },
          })
        }
      } else {
        const source = chooseSource(creep)
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
        }
      }
    }
  },
}

module.exports = roleUpgrader
