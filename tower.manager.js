var towerManager = {
  run(room) {
    const towers = room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER },
    })

    for (const tower of towers) {
      if (tower) {
        const closestDamagedStructure = tower.pos.findClosestByRange(
          FIND_STRUCTURES,
          {
            filter: structure =>
              structure.hits < structure.hitsMax &&
              structure != tower &&
              structure.structureType != STRUCTURE_WALL,
          }
        )
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        const roomName = tower.room.name

        const damagedCreep = Game.rooms[roomName].find(FIND_MY_CREEPS, {
          filter: creep => {
            return creep.hits < creep.hitsMax
          },
        })

        if (closestHostile) {
          console.log('there is a hostile')
          const result = tower.attack(closestHostile)
          console.log(`attack result: ${result}`)
        } else if (damagedCreep.name) {
          console.log(`healing: ${damagedCreep}`)
          tower.heal(damagedCreep)
        } else if (closestDamagedStructure) {
          // console.log(`repairing: ${closestDamagedStructure}`)
          tower.repair(closestDamagedStructure)
        }
      }
    }
  },
}

module.exports = towerManager
